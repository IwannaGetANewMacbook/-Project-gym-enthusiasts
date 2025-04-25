import { AuthEmailService } from './auth.email.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
  // secureCookie => auth의 대부분의 라우터에 공통적으로 쓰이기때문에 클래스레벨에서 변수선언.
  private readonly secureCookie: boolean;
  private oauthClient: OAuth2Client;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly authEmailService: AuthEmailService,
  ) {
    // .env 파일에서 COOKIE_SECURE 값을 불러와 Boolean으로 저장
    this.secureCookie = true;
    this.oauthClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
    );
  }

  @Post('token/access')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  createTokenAccess(
    @Res({ passthrough: true }) res: Response,
    @Headers('Cookie') rawToken: string,
  ) {
    try {
      // console.log('로우한토큰: ', rawToken);
      const token = this.authService.extractTokenFromHeaderForRefresh(rawToken);
      // console.log('정제된 토큰: ', token);

      const newToken = this.authService.rotateToken(token, false);

      // { accessToken: { token } } 이런식으로 반환할꺼.
      return {
        accessToken: newToken,
      };
    } catch (e) {
      this.logout(res);
    }
  }

  @Post('token/refresh')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  createTokenRefresh(
    @Res({ passthrough: true }) res: Response,
    @Headers('cookie') rawToken: string,
  ) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, true);

    // { refreshToken: { token } } 이런식으로 반환할꺼.
    // HttpOnly 쿠키로 refresh token 설정
    res.cookie('refreshToken', newToken, {
      // 쿠키가 클라이언트의 JavaScript 코드에서 접근할 수 없게 설정.
      httpOnly: true,
      // secure 옵션이 true로 설정되면 HTTPS 연결에서만 쿠키가 전송됨.
      // 개발환경에선 false, production환경에선 true.
      secure: true,
      // strict => 동일한 사이트에서만 쿠키가 전송됨.  CSRF 공격을 방지하기 위해 크로스 사이트 쿠키 전송 제한.
      // lax => 약간의 크로스 사이트 요청에 쿠키가 전송.
      // none => 모든 종류의 크로스사이트 요청에서 쿠키가 전송됨. 이 경우 secure옵션이 "true"여야함.
      sameSite: 'none',
      //  쿠키의 유효 기간을 밀리초 단위로 설정하는 옵션
      maxAge: 3600 * 1000, // 적절한 만료 시간(밀리초 단위)
      path: '/',
    });

    return {
      message: 'Refresh token set as HttpOnly cookie',
    };

    // return {
    //   refreshToken: newToken,
    // };
  }

  // 로그인 end point
  @Post('login/email')
  @IsPublic()
  @UseGuards(BasicTokenGuard)
  async loginWithEmail(
    @Headers('authorization') rawToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    // email:password -> base64로 encoding
    // sddsdwsdfdsfdsdf:wjkdkwljdj -> email:password 로 변환.
    /** extractTokenFromHeader()함수에서 'Basic'or'Bearer' prefix 날려보냄 */
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    const { accessToken, refreshToken, user } =
      await this.authService.loginWithEmail(credentials);

    // HttpOnly 쿠키로 refresh token 설정
    res.cookie('refreshToken', refreshToken, {
      // 쿠키가 클라이언트의 JavaScript 코드에서 접근할 수 없게 설정.
      httpOnly: true,
      // secure 옵션이 true로 설정되면 HTTPS 연결에서만 쿠키가 전송됨.
      // 개발환경에선 false, production환경에선 true.
      secure: true,
      // strict => 동일한 사이트에서만 쿠키가 전송됨.  CSRF 공격을 방지하기 위해 크로스 사이트 쿠키 전송 제한.
      // lax => 약간의 크로스 사이트 요청에 쿠키가 전송.
      // none => 모든 종류의 크로스사이트 요청에서 쿠키가 전송됨. 이 경우 secure옵션이 "true"여야함.
      sameSite: 'none',
      //  쿠키의 유효 기간을 밀리초 단위로 설정하는 옵션
      maxAge: 3600 * 1000, // 적절한 만료 시간(밀리초 단위)
      path: '/',
    });
    return {
      message: 'Refresh token set as HttpOnly cookie',
      accessToken,
      refreshToken,
      user,
    };

    // 기존 코드
    // return this.authService.loginWithEmail(credentials);
  }

  // 회원가입 end point
  @Post('register/email')
  @IsPublic()
  async registerWithEmail(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { nickname, email, password } = body;

    // 1. 이메일 인증 여부 확인
    const verification =
      await this.authEmailService.findLatestVerificationByEmail(email);
    if (!verification || !verification.isVerified) {
      throw new BadRequestException('이메일 인증이 필요합니다.');
    }

    // 2. 회원가입 로직 실행
    const { accessToken, refreshToken, user } =
      await this.authService.registerWithEmail({ nickname, email, password });

    // 3. HttpOnly 쿠키로 refresh token 설정
    res.cookie('refreshToken', refreshToken, {
      // 쿠키가 클라이언트의 JavaScript 코드에서 접근할 수 없게 설정.
      httpOnly: true,
      // secure 옵션이 true로 설정되면 HTTPS 연결에서만 쿠키가 전송됨.
      // 개발환경에선 false, production환경에선 true.
      secure: true,
      // strict => 동일한 사이트에서만 쿠키가 전송됨.  CSRF 공격을 방지하기 위해 크로스 사이트 쿠키 전송 제한.
      // lax => 약간의 크로스 사이트 요청에 쿠키가 전송.
      // none => 모든 종류의 크로스사이트 요청에서 쿠키가 전송됨. 이 경우 secure옵션이 "true"여야함.
      sameSite: 'none',
      //  쿠키의 유효 기간을 밀리초 단위로 설정하는 옵션
      maxAge: 3600 * 1000, // 적절한 만료 시간(밀리초 단위)
      path: '/',
    });

    return {
      message: 'Refresh token set as HttpOnly cookie',
      accessToken,
      refreshToken,
      user,
    };

    // 기존의 cookie설정하지 않은 코드.
    // return this.authService.registerWithEmail({ nickname, email, password });
  }

  @Post('logout')
  @IsPublic() // 로그아웃은 모든 사용자가 접근 가능해야 함
  @UseGuards(RefreshTokenGuard) // 사용자의 인증을 확인하기 위해 사용
  // passthrough: true => Express의 Response 객체를 통해 쿠키를 조작하기 위해 사용
  async logout(@Res({ passthrough: true }) res: Response) {
    // 쿠키에서 refreshToken 삭제
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true, // 로컬 환경일 경우 false, 배포 시 true로 변경
      sameSite: 'none', // 프론트엔드와 백엔드가 다른 도메인/포트인 경우 적합
      path: '/', // 쿠키가 적용된 경로, "/"로 설정하여 모든 경로에서 쿠키가 삭제되도록 함.
    });

    return {
      message: 'Logged out successfully',
    };
  }

  /**
   * 회원 가입시 유저가 입력한 닉네임이 중복인지 확인하는 API
   */
  @Get('check-nickname')
  @IsPublic()
  async checkNickname(@Query('nickname') nickname: string) {
    const isNickname = await this.usersService.CheckUserByNickname(nickname);
    if (isNickname) {
      return {
        isAvailable: false,
      };
    }
    return { isAvailable: true };
  }

  @Get('validateAccessToken')
  validateAccessToken() {
    return true;
  }

  /**
   * Google OAuth 로그인 관련 API
   */

  /**
   * Google OAuth 로그인 완료 후, 프론트에서 받은 ID 토큰 검증 및 사용자 정보 추출
   */
  @Post('google/callback')
  @IsPublic()
  async googleLoin(
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('✅ [google/callback] 요청 수신됨');
    try {
      // 1. 토큰을 구글에 검증 요청
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      // 2. 구글로부터 받은 사용자 정보 파싱
      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('유효하지 않은 구글 사용자입니다.');
      }

      // 3. 필요한 정봅만 추출
      const { email, name, picture } = payload;

      console.log('✅ 구글 사용자:', { email, name, picture });

      // 4. 사용자 DB 저장 or 기존 사용자 조회
      const user = await this.usersService.findOrCreateByGoogle({
        email,
        nickname: name,
        picture,
      });

      console.log('4번에 대한 유저: ', user);
      const userToGetAccToken = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      };
      console.log('✅ 구글 사용자 DB 저장:', userToGetAccToken);

      // 5. accessToke, refreshToken 발급
      const { accessToken, refreshToken } =
        this.authService.loginUser(userToGetAccToken);

      console.log('✅ 구글 로그인 성공:', { accessToken, refreshToken });
      // 6. refreshToken을 HttpOnly 쿠키로 설정
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3600 * 1000, // 1시간
        path: '/',
      });

      // 7. 응답 반환
      return {
        message: '구글 로그인 성공!',
        accessToken,
        refreshToken,
        user: {
          UserEmail: user.email,
          userNickname: user.nickname,
        },
      };
    } catch (error) {
      console.error('❌ 구글 로그인 실패: ', error);
      throw new UnauthorizedException('구글 로그인 실패: ' + error.message);
    }
  }

  /** ------------------------------------------------------------------------------ */
  /**
   * 사용자 비밀번호 재설정을 위한 APIs.
   */

  @IsPublic()
  @Post('reset-password/request')
  async requestPasswordReset() {
    return 1;
  }
}

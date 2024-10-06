import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicTokenGuard } from './guard/basic-token.guard';
import { RefreshTokenGuard } from './guard/bearer-token.guard';
import { RegisterUserDto } from './dto/register-user.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  createTokenAccess(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);

    const newToken = this.authService.rotateToken(token, false);

    // { accessToken: { token } } 이런식으로 반환할꺼.
    return {
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  createTokenRefresh(
    @Headers('authorization') rawToken: string,
    @Res({ passthrough: true }) res: Response,
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
      secure: false,
      // strict => 동일한 사이트에서만 쿠키가 전송됨.  CSRF 공격을 방지하기 위해 크로스 사이트 쿠키 전송 제한.
      // lax => 약간의 크로스 사이트 요청에 쿠키가 전송.
      // none => 모든 종류의 크로스사이트 요청에서 쿠키가 전송됨. 이 경우 secure옵션이 "true"여야함.
      sameSite: 'lax',
      //  쿠키의 유효 기간을 밀리초 단위로 설정하는 옵션
      maxAge: 3600 * 1000, // 적절한 만료 시간(밀리초 단위)
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
      secure: false,
      // strict => 동일한 사이트에서만 쿠키가 전송됨.  CSRF 공격을 방지하기 위해 크로스 사이트 쿠키 전송 제한.
      // lax => 약간의 크로스 사이트 요청에 쿠키가 전송.
      // none => 모든 종류의 크로스사이트 요청에서 쿠키가 전송됨. 이 경우 secure옵션이 "true"여야함.
      sameSite: 'lax',
      //  쿠키의 유효 기간을 밀리초 단위로 설정하는 옵션
      maxAge: 3600 * 1000, // 적절한 만료 시간(밀리초 단위)
    });
    return {
      message: 'Refresh token set as HttpOnly cookie',
      accessToken,
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

    // 회원가입 로직 실행
    const { accessToken, refreshToken, user } =
      await this.authService.registerWithEmail({ nickname, email, password });

    // HttpOnly 쿠키로 refresh token 설정
    res.cookie('refreshToken', refreshToken, {
      // 쿠키가 클라이언트의 JavaScript 코드에서 접근할 수 없게 설정.
      httpOnly: true,
      // secure 옵션이 true로 설정되면 HTTPS 연결에서만 쿠키가 전송됨.
      // 개발환경에선 false, production환경에선 true.
      secure: false,
      // strict => 동일한 사이트에서만 쿠키가 전송됨.  CSRF 공격을 방지하기 위해 크로스 사이트 쿠키 전송 제한.
      // lax => 약간의 크로스 사이트 요청에 쿠키가 전송.
      // none => 모든 종류의 크로스사이트 요청에서 쿠키가 전송됨. 이 경우 secure옵션이 "true"여야함.
      sameSite: 'lax',
      //  쿠키의 유효 기간을 밀리초 단위로 설정하는 옵션
      maxAge: 3600 * 1000, // 적절한 만료 시간(밀리초 단위)
    });

    return {
      message: 'Refresh token set as HttpOnly cookie',
      accessToken,
      user,
    };

    // 기존의 cookie설정하지 않은 코드.
    // return this.authService.registerWithEmail({ nickname, email, password });
  }

  @Get('checkValidToken')
  checkValidToken() {
    return true;
  }
}

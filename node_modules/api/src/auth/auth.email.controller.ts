import { AuthEmailService } from './auth.email.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth/email')
export class AuthEmailController {
  constructor(
    private readonly mailService: MailService,
    private readonly authEmailService: AuthEmailService,
  ) {}
  /**
   * [1단계] 이메일 인증 요청 API
   * 사용자가 이메일 인증 버튼을 클릭하면 호출됨.
   */

  @IsPublic()
  @Post('request-verification')
  async requestEmailVerification(@Body('email') email: string) {
    console.log('이메일 인증 요청: ', email);
    if (!email || !email.includes('@')) {
      throw new Error('올바른 이메일 형식을 입력해주세요.');
    }
    const token = await this.authEmailService.generateEmailVerification(email);
    await this.mailService.sendVerificationEmail(email, token);

    return {
      message: '인증 메일을 전송했습니다. 이메일을 확인해주세요.',
    };
  }

  /**
   * [2단계] 이메일 인증 확인 API
   * 사용자가 이메일로 받은 인증 링크를 클릭하면,
   * 해당 링크에 포함된 token 값을 기반으로 DB에서 일치하는 토큰을 찾고,
   * 인증 처리(isVerified: true)를 진행.
   */
  @IsPublic()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('토큰이 제공되지 않았습니다.');
    }

    const result = await this.authEmailService.verifyEmailToken(token);
    return {
      result,
      message: '이메일 인증이 완료되었습니다.',
    };
  }

  /** ------------------------------------------------------------------------------ */
  /** ------------------------------------------------------------------------------ */
  /**
   * 사용자 비밀번호 재설정을 위한 APIs.
   */
  // 사용자에게 비밀번호 재설정 요청 전송 API
  @IsPublic()
  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    if (!email || !email.includes('@')) {
      throw new BadRequestException('올바른 이메일 형식을 입력해주세요.');
    }

    const token = await this.authEmailService.requestPasswordReset(email);
    await this.mailService.sendResetPasswordEmail(email, token);

    return {
      message: '비밀번호 재설정 메일을 전송했습니다. 이메일을 확인해주세요.',
    };
  }

  // 사용자및 데이터가 유효하면 유저의 비밀번호 번경 PATCH API.
  @IsPublic()
  @Patch('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { token, newPassword } = body;
    await this.authEmailService.resetPassword(token, newPassword);

    return {
      message: '비밀번호가 성공적으로 재설정되었습니다.',
    };
  }
}

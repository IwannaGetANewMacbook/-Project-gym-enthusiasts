import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { MailService } from './mail.service';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

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
    const token = await this.mailService.generateEmailVerification(email);
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

    const result = await this.mailService.verifyEmailToken(token);
    return {
      result,
      message: '이메일 인증이 완료되었습니다.',
    };
  }
}

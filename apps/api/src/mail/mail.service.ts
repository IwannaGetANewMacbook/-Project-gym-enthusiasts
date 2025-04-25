import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { generateVerifyEmailHtml } from './templates/VerifyEmailTemplate';
import { generateResetPasswordEmailHtml } from './templates/ResetPasswordTemplate';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<boolean>('SMTP_SECURE'), // true = 465, false = other
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verificationLink = `${frontendUrl}/auth/email/verify-email?token=${token}`;
    const brandName = this.configService.get<string>('MAIL_FROM_NAME');

    const mailOptions = {
      from: `"${brandName}" <${this.configService.get('MAIL_FROM_EMAIL')}>`,
      to: email,
      subject: '📬 [Action Required] 이메일 인증을 완료해 주세요',
      html: generateVerifyEmailHtml('', verificationLink, brandName),
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;
    const brandName = this.configService.get<string>('MAIL_FROM_NAME');

    const mailOptions = {
      from: `"${brandName}" <${this.configService.get('MAIL_FROM_EMAIL')}>`,
      to: email,
      subject: '🔐 [Action Required] 비밀번호를 재설정 해주세요',
      html: generateResetPasswordEmailHtml('', resetLink, brandName),
    };

    await this.transporter.sendMail(mailOptions);
  }
}

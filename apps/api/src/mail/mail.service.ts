import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { EmailVerificationModel } from 'src/auth/entity/email-verification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateVerifyEmailHtml } from './templates/VerifyEmailTemplate';
import * as crypto from 'crypto';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(
    private configService: ConfigService,
    @InjectRepository(EmailVerificationModel)
    private readonly emailVerificationRepository: Repository<EmailVerificationModel>,
  ) {
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

  // 이메일 인증 토큰 발급 및 저장
  async generateEmailVerification(email: string) {
    // 이미 인증된 이이메일인지 확인
    const existing = await this.emailVerificationRepository.findOne({
      where: { email },
      // 가장 최근에 생성된 레코드를 가져오기 위해 필요.
      order: { createdAt: 'DESC' },
    });

    if (existing && existing.isVerified) {
      throw new BadRequestException('이미 인증된 이메일입니다.');
    }

    const token = crypto.randomUUID(); // UUID 생성
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10분 후 만료

    const newVerification = this.emailVerificationRepository.create({
      email,
      token,
      expiresAt,
      isVerified: false,
    });

    await this.emailVerificationRepository.save(newVerification);

    return token;
  }

  async sendVerificationEmail(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verificationLink = `${frontendUrl}/mail/verify-email?token=${token}`;
    const brandName = this.configService.get<string>('MAIL_FROM_NAME');

    const mailOptions = {
      from: `"${brandName}" <${this.configService.get('MAIL_FROM_EMAIL')}>`,
      to: email,
      subject: '📬 [Action Required] 이메일 인증을 완료해 주세요',
      html: generateVerifyEmailHtml('', verificationLink, brandName),
    };

    await this.transporter.sendMail(mailOptions);
  }

  // 이메일 인증이 완료되었는지를 확인하는 메서드
  async findLatestVerificationByEmail(email: string) {
    return await this.emailVerificationRepository.findOne({
      where: { email },
      // 가장 최근에 생성된 레코드를 가져오기 위해 필요.
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ 이메일 인증 확인 메서드
  async verifyEmailToken(token: string) {
    const record = await this.emailVerificationRepository.findOne({
      where: { token },
    });

    if (!record) {
      throw new NotFoundException('유효하지 않은 토큰입니다.');
    }

    if (record.isVerified) {
      throw new BadRequestException('이미 인증된 이메일입니다.');
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('토큰이 만료되었습니다.');
    }

    record.isVerified = true;
    await this.emailVerificationRepository.save(record);
    return record;
  }
}

import { UsersService } from 'src/users/users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailVerificationModel } from './entity/email-verification.entity';
import { LessThan, Repository } from 'typeorm';
import { ResetPasswordTokenModel } from './entity/reset-password-token.entity';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthEmailService {
  constructor(
    @InjectRepository(EmailVerificationModel)
    private readonly emailVerificationRepository: Repository<EmailVerificationModel>,
    @InjectRepository(ResetPasswordTokenModel)
    private readonly resetPasswordTokenRepository: Repository<ResetPasswordTokenModel>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

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

  /** ------------------------------------------------------------------------------ */
  /** ------------------------------------------------------------------------------ */
  /**
   * 사용자 비밀번호 재설정을 위한 APIs.
   */

  /**
   * 🔐 비밀번호 재설정 요청
   * - 사용자의 이메일로 비밀번호 재설정 토큰을 전송
   */
  async requestPasswordReset(email: string) {
    // ✅ 만료 & 사용된 토큰 정리
    await this.deleteExpiredAndUsedTokens();

    // 1 .유저 존재 여부 확인
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    // 2. 랜덤 토큰 생성(crypto)
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10분 후 만료

    // 3. 토큰 저장
    const resetToken = this.resetPasswordTokenRepository.create({
      email,
      token,
      expiresAt,
      isUsed: false,
    });
    await this.resetPasswordTokenRepository.save(resetToken);

    return token;
  }

  /**
   * 비밀번호 요청이 성공적으로 들어오면 실제로 비밀번호를 변경하는 로직.
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const record = await this.resetPasswordTokenRepository.findOne({
      where: { token },
    });

    if (!record) {
      throw new NotFoundException('유효하지 않은 토큰.');
    }

    if (record.isUsed) {
      throw new BadRequestException('이미 사용된 토큰입니다.');
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestException('토큰이 만료되었습니다.');
    }

    // 사용자 조회.
    const user = await this.usersService.getUserByEmail(record.email);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 비밀번호 해쉬.
    const hashed = await bcrypt.hash(
      newPassword,
      parseInt(this.configService.get<string>('HASH_ROUNDS')),
    );

    // 해쉬된 비밀번호를 사용하여 유저정보 업데이트.
    const hashedPassword = (user.password = hashed);
    await this.usersService.updateUser(user.id, { password: hashedPassword });

    // 토큰 사용처리
    record.isUsed = true;
    await this.resetPasswordTokenRepository.save(record);
  }

  /**
   * 비밀번호 재설정 토큰 clean-up 함수
   * 비밀번호 재설정 토큰 중에서 만료되었고 이미 사용된 것들을 사용자 요청이 들어올 때마다 정리(clean-up)하는 것
   */
  async deleteExpiredAndUsedTokens(): Promise<void> {
    await this.resetPasswordTokenRepository.delete({
      // 이 두 조건을 동시에 만족해야 삭제됨.
      isUsed: true,
      expiresAt: LessThan(new Date()), // 현재보다 이전이면 만료된 토큰
    });
  }
}

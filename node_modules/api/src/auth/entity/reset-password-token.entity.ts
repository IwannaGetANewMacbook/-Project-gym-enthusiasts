// /src/auth/entity/reset-password-token.entity.ts

import { IsBoolean, IsDate, IsEmail, IsUUID } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ResetPasswordTokenModel extends BaseModel {
  // 비밀번호 재설정을 요청한 사용자 이메일
  @Column()
  @IsEmail()
  email: string;

  // 랜덤으로 생성된 재설정 토큰
  @Column()
  @IsUUID()
  token: string;

  // 토큰 만료 시간
  @Column()
  @IsDate()
  expiresAt: Date;

  // 이미 사용된 토큰인지 여부
  @Column({ default: false })
  @IsBoolean()
  isUsed: boolean;
}

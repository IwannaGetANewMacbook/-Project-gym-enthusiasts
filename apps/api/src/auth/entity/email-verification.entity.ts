/**
 * 이 모델은 이메일 주소와 함께 인증 토큰, 만료 시간 등을 저장해주는 역할.
 */

import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class EmailVerificationModel extends BaseModel {
  @Column()
  email: string;

  // 고유한 랜덤 문자열 (예: UUID)
  @Column()
  token: string;

  // 10분 혹은 30분 같은 제한된 시간
  @Column()
  expiresAt: Date;

  // 사용자가 링크를 클릭했는지 여부
  @Column({ default: false })
  isVerified: boolean;
}

import { IsString } from 'class-validator';

// email-verification.dto.ts
export class EmailVerificationDto {
  @IsString()
  token: string;
}

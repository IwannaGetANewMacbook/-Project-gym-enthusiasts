import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationModel } from 'src/auth/entity/email-verification.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([EmailVerificationModel])], // ConfigService를 사용하기 위해 ConfigModule을 import함.
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService], // MailService를 다른 모듈에서 사용할 수 있도록 export함.
})
export class MailModule {}

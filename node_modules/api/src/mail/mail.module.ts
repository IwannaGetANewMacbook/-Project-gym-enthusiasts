import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // ConfigService를 사용하기 위해 ConfigModule을 import함.
    ConfigModule,
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService], // MailService를 다른 모듈에서 사용할 수 있도록 export함.
})
export class MailModule {}

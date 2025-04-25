import { ResetPasswordTokenModel } from './entity/reset-password-token.entity';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthEmailService } from './auth.email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailVerificationModel } from './entity/email-verification.entity';
import { AuthEmailController } from './auth.email.controller';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
    MailModule,
    TypeOrmModule.forFeature([EmailVerificationModel, ResetPasswordTokenModel]),
  ],
  controllers: [AuthController, AuthEmailController],
  providers: [AuthService, AuthEmailService],
  exports: [AuthService],
})
export class AuthModule {}

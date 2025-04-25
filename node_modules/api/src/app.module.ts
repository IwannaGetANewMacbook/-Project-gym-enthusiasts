import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from './test/test.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';

import { ConfigModule } from '@nestjs/config';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from './common/const/env-keys.const';
// import {
//   ENV_DB_DATABASE_KEY,
//   ENV_DB_HOST_KEY,
//   ENV_DB_PASSWORD_KEY,
//   ENV_DB_PORT_KEY,
//   ENV_DB_USERNAME_KEY,
// } from './common/const/env-keys.const';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';
import { UsersModel } from './users/entity/users.entity';
import { LogMiddleware } from './common/middleware/log.middleware';
import { PostsModule } from './posts/posts.module';
import { ChatsModule } from './chats/chats.module';
import { PostsModel } from './posts/entity/posts.entity';
import { ChatsModel } from './chats/entity/chat.entity';
import { MessagesModel } from './chats/messages/entity/messages.entity';
import { CommentsModel } from './posts/comments/entity/comments.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guard/bearer-token.guard';
import { RolesGuard } from './users/guard/roles.guard';
import { SocialLinkModel } from './users/entity/social-link.entity';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
// import { ImageController } from './image.controller';
import { MailModule } from './mail/mail.module';
import { EmailVerificationModel } from './auth/entity/email-verification.entity';
import { ResetPasswordTokenModel } from './auth/entity/reset-password-token.entity';

@Module({
  imports: [
    MulterModule.register({ limits: { fileSize: 10 * 1024 * 1024 } }), // 최대 10MB로 설정
    TestModule,
    MailModule, // 메일 모듈 추가
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // 데이터베이스 타입
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      entities: [
        PostsModel,
        UsersModel,
        ChatsModel,
        MessagesModel,
        CommentsModel,
        SocialLinkModel,
        EmailVerificationModel,
        ResetPasswordTokenModel,
      ],
      // synchronize: true -> nestJS에서 작성하는 typeORM코드와 db싱크를 자동으로 맞추겠다!
      // 개발환경에서는 synchronize: true, 프로덕션 환경에서는 synchronize: false
      synchronize: true,
      ssl:
        process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // 이 부분 추가
    }),
    CommonModule,
    UsersModule,
    AuthModule,
    PostsModule,
    ChatsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      /**
       * 이렇게 하면 class-transformer 애노테이션이 적용된 모든 API에
       * Interceptor 애노테이션이 자동적으로 적용됨. (app.module은 최상단 module.)
       */
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, // 어떤 클래스를 적용할지.
    },
    // app 전체에다가 guard 등록함.
    // 주의!: app 전체에 등록한 guard는 해당API에 등록한 guard 보다 무조건 먼저 실행됨.
    {
      // app안에 있는 API 전체에다가 토큰가드 씌어서 privateAPI로 만들어버림.
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    CloudinaryService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

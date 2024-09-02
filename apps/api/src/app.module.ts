import {
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
import { LogMiddleware } from './common/middleware/log-middleware';

@Module({
  imports: [
    TestModule,
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
      entities: [UsersModel],
      // synchronize: true -> nestJS에서 작성하는 typeORM코드와 db싱크를 자동으로 맞추겠다!
      // 개발환경에서는 synchronize: true, 프로덕션 환경에서는 synchronize: false
      synchronize: true,
    }),
    CommonModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

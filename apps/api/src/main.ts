import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: [
      'https://localhost:5173',
      'https://project-gym-enthusiasts-ui.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization', 'X-Token'],
    credentials: true,
  });

  // cookie-parser 미들웨어 사용
  app.use(cookieParser());

  /**이 앱 전반적으로 class-validator 모듈을 적용 */
  app.useGlobalPipes(
    new ValidationPipe({
      /** dto파일안에서 기본값으로 지정한 property들을 controller에서도 똑같이 적용하게 하게 하기 위함.*/
      transform: true,
      transformOptions: {
        // class-validator Anotation에 적용된 타입으로 class-transformer가 자동으로 해당 property 타입을 변환해줌.
        enableImplicitConversion: true,
      },
      // whitelist 옵션이 true가 되면은 validator가 지금 현재 validation이 적용되지 않은 모든 property들을 삭제할것.
      whitelist: true,
      /** whitelist가 true일 경우 stripping을 하는 대신 error를 던짐. */
      forbidNonWhitelisted: true,
    }),
  );

  /**HTTP 관련된 모든 excpetion이 발생할때 마다 이 서버 전체에서 HttpExceptionFilter 가 적용됨. */
  // app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();

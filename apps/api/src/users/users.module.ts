import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersModel])],
  controllers: [UsersController],
  providers: [UsersService],
  // 타  모듈에서 해당모듈의 서비스를 사용하고 싶을 때 무조건 export 배열에 등록!!

  exports: [UsersService],
})
export class UsersModule {}

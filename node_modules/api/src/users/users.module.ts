import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';

import { SocialLinkModel } from './entity/social-link.entity';
import { CloudinaryService } from 'src/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel, SocialLinkModel]), // file을 다운로드 받을때 여러가지 옵션들을 제공해 줄 수 있는 기능.
  ],
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService],
  // 타  모듈에서 해당모듈의 서비스를 사용하고 싶을 때 무조건 export 배열에 등록!!

  exports: [UsersService],
})
export class UsersModule {}

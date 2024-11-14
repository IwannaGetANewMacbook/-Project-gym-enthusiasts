import { BadRequestException, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { USER_IMAGE_PATH } from 'src/common/const/path.const';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel]), // file을 다운로드 받을때 여러가지 옵션들을 제공해 줄 수 있는 기능.
    MulterModule.register({
      // limits = 파일 크기 제한
      limits: {
        // bite 단위로 입력
        fieldSize: 10000000, // 10mb
      },
      fileFilter: (req, file, cb) => {
        /**
         * cb(error, boolean)
         *
         * 첫번째 파라미터에는 에러가 있을 경우 에러 정보를 넣어준다.
         * 두번째 파라미터에는 파일을 받을 지 말지 boolean값을 넣어준다.
         */

        // extname()함수는 파일의 확장자만 따와주는 함수.
        // e.g. xxx.jpg -> .jpg =>
        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(new BadRequestException('jpg/jpeg/png only'), false);
        }

        // if문 통과하면 error는 null로 처리하고 파일을 다운.
        return cb(null, true);
      },
      storage: multer.diskStorage({
        // 파일을 다운로드 했을 때 파일을 어디로 보낼건지.(폴더까지만 입력)
        destination: function (req, res, cb) {
          cb(null, USER_IMAGE_PATH); // 파일을 저장할 위치.
        },
        // 파일이름 작명
        filename: function (req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  // 타  모듈에서 해당모듈의 서비스를 사용하고 싶을 때 무조건 export 배열에 등록!!

  exports: [UsersService],
})
export class UsersModule {}

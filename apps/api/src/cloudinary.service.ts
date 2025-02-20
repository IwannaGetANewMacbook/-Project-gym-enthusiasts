import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { ENV_CLOUDINARY_CLOUD_NAME_KEY } from './common/const/env-keys.const';

export enum CloudinaryPathEnum {
  post = 'post',
  user = 'user',
}

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    v2.config({
      cloud_name: this.configService.get<string>(ENV_CLOUDINARY_CLOUD_NAME_KEY),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    files: Array<Express.Multer.File>,
    path: CloudinaryPathEnum,
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    if (!files || files.length === 0) {
      throw new Error('No files found');
    }

    const uploadPromises = files.map((file) => {
      return new Promise<UploadApiResponse | UploadApiErrorResponse>(
        (resolve, reject) => {
          v2.uploader
            .upload_stream(
              {
                folder: `${this.configService.get<string>('LocalOrDeploy')}/${path}`,
                resource_type: 'image', // MIME 타입 명시.
              },
              (error, result) => {
                if (error) {
                  return reject(error);
                }
                resolve(result);
              },
            )
            .end(file.buffer); // 파일 버퍼로 업로드
        },
      );
    });

    return Promise.all(uploadPromises);
  }
}

/**
 * Cloudinary로 파일 업로드 후 Postman에서 받는 Response JSON에는 업로드된 파일의 정보가 상세히 담겨 있습니다.
 * 아래는 각 필드의 설명입니다:
 *
 *
 */

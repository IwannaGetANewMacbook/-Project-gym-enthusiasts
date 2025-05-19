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
    // console.log('요청 받은 파일들: ', files);
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

  // Cloudinary에서 이미지 삭제
  // publicId: 이미지의 고유 아이디
  async deleteImage(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Cloudinary 이미지 삭제 오류:', error);
          reject(error);
        } else {
          console.log('Cloudinary 이미지 삭제 성공:', result);
          resolve();
        }
      });
    });
  }

  /**
   * Cloudinary 이미지 URL에서 publicId 추출하는 함수
   * 예시: https://res.cloudinary.com/dbb5z072p/image/upload/v1740652070/local/post/rjmre3ypzodknrbyyfiv.jpg
   * 반환값: local/post/rjmre3ypzodknrbyyfiv
   */
  extractPublicId(imageUrl: string): string {
    const parts = imageUrl.split('/image/upload/')[1].split('/');
    parts.shift(); // 버전 정보 제거 (ex. v1740652070)
    // 배열을 다시 /로 합치고 확장자 제거
    return parts.join('/').replace(/\.[^.]+$/, '');
  }
}

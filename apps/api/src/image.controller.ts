// import { FilesInterceptor } from '@nestjs/platform-express';
// import { CloudinaryService } from './cloudinary.service';
// import {
//   Controller,
//   Post,
//   // UploadedFile,
//   UploadedFiles,
//   UseInterceptors,
// } from '@nestjs/common';
// import { IsPublic } from './common/decorator/is-public.decorator';

// @Controller('images')
// export class ImageController {
//   constructor(private readonly cloudinaryService: CloudinaryService) {}

//   @IsPublic()
//   @Post('upload')
//   @UseInterceptors(FilesInterceptor('images', 3))
//   async uploadFiles(@UploadedFiles() files?: Array<Express.Multer.File>) {
//     try {
//       const results = await this.cloudinaryService.uploadImage(files);
//       return results;
//     } catch (e) {
//       console.log('Error uploading image:', e);
//       throw new Error('Failed to upload image');
//     }
//   }
// }

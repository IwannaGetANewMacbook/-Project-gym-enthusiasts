/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { UsersModel } from 'src/users/entity/users.entity';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import {
  FileFieldsInterceptor,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { LogInterceptor } from 'src/common/interceptor/log.interceptor';
import { HttpExceptionFilter } from 'src/common/exception-filter/http.exception-filter';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RolesEnum } from 'src/users/const/roles.const';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { IsPostMineOrAdminGuard } from './guard/is-post-mine-or-admin.guard';
import { CloudinaryPathEnum, CloudinaryService } from 'src/cloudinary.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  // @IsPublic()
  // @UseInterceptors(LogInterceptor)
  getPosts(@Query() query: PaginatePostDto) {
    return this.postsService.paginatePosts(query);
  }

  // 테스트용 임의 API
  @Post('random')
  async postPostsRandom(@User() user: UsersModel) {
    await this.postsService.generatePosts(user.id);
    return true;
  }

  @Get(':id')
  // @IsPublic()
  // @UseInterceptors(LogInterceptor)
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 3))
  // @UseInterceptors(LogInterceptor)
  // @UseInterceptors(ImagesTransformInterceptor)
  async createPost(
    @User() user: UsersModel,
    @Body() body: CreatePostDTO,
    // @Body('title') title: string,
    // @Body('content') content: string,
    @UploadedFiles() files?: Array<Express.Multer.File>, // 다중 파일 수신
  ) {
    console.log('일단 postcontroller에 요청이 들어옴.', ' files: ', files);
    try {
      // 1. cloudinary에 이미지 업로드 및 URL 가져오기
      const uploadResults = await this.cloudinaryService.uploadImage(
        files,
        CloudinaryPathEnum.post,
      );
      const imageUrls = uploadResults.map((result) => result.secure_url); // 이미지 URL만 추출

      // 2. 이미지 URL과 개시글 정보를 함께 저장
      return await this.postsService.createPost(
        user.id,
        body.title,
        body.content,
        imageUrls,
      );
    } catch (e) {
      console.log('Error uploading image:', e);
      throw new BadRequestException('Failed to upload image');
    }

    // return this.postsService.createPost(
    //   user.id,
    //   body.title,
    //   body.content,
    //   files ? files : undefined, // 만약 file이 undefined면 undefined 그대로 전달.
    // );
  }

  //
  @Patch(':postId')
  @UseGuards(IsPostMineOrAdminGuard)
  updatePost(
    @Param('postId', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
    // @Body('title') title?: string,
    // @Body('content') content?: string,
  ) {
    return this.postsService.updatePost(id, body.title, body.content);
  }

  @Delete(':postId')
  // @Roles(RolesEnum.ADMIN)
  @UseGuards(IsPostMineOrAdminGuard)
  deletePost(@Param('postId', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }

  // 마이페이지 라우팅
  @Get('myposts/:username')
  getPostsMine(
    @Param('username') username: string,
    @Query() query: PaginatePostDto,
  ) {
    return this.postsService.getPostsMine(username, query);
  }
}

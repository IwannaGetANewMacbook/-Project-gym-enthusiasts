/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from './decorator/roles.decorator';
import { RolesEnum } from './const/roles.const';
import { UsersModel } from './entity/users.entity';
import { User } from './decorator/user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDTO } from 'src/posts/dto/create-post.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSocialLinkDto } from './dto/create-socialLink.dto';
import { UpdateSocialLinksDto } from './dto/update-socialLinks.dto';
import { IsSocialLinkMineOrAdminGuard } from './guard/is-socialLink-mine-or-admin.guard';
import { CloudinaryPathEnum, CloudinaryService } from 'src/cloudinary.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  /**
   * serialization -> 직렬화 -> 현재 시스템에서 사용되는 (NestJS) 데이터의 구조를
   *                           다른 시스템에서도 쉽게 사용할 수 있는 포맷으로 변환
   *                         -> class의 object에서 JSON 포맷으로 변환.
   */
  @Roles(RolesEnum.ADMIN)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('myProfile')
  getMyProfile(@User() user: UsersModel) {
    return this.usersService.getUserByEmail(user.email);
  }

  @Get('profile/:username')
  getUserByUsername(
    @User() user: UsersModel,
    @Param('username') username: string,
  ) {
    return this.usersService.getUserByUsername(username);
  }

  @Put('updateUserProfileInfo')
  // FilesInterceptor를 등록을 하면은 moduel.ts 에서 등록한 multer모듈의 세팅이 확인되고 실행되고 이미지 파일을 해당 폴더안으로 넣어줌.
  // @UseInterceptors(LogInterceptor)
  updateUserProfileInfo(
    @User() user: UsersModel,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateUserProfileInfo(user, updateProfileDto);
  }

  @Put('updateUserProfilePicture')
  // FilesInterceptor를 등록을 하면은 moduel.ts 에서 등록한 multer모듈의 세팅이 확인되고 실행되고 이미지 파일을 해당 폴더안으로 넣어줌.
  @UseInterceptors(FilesInterceptor('images', 1))
  // @UseInterceptors(LogInterceptor)
  async updateUserProfile(
    @User() user: UsersModel,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    try {
      // 1. cloudinary에 이미지 업로드 및 URL 가져오기
      const uploadResults = await this.cloudinaryService.uploadImage(
        files,
        CloudinaryPathEnum.user,
      );
      const imageUrls = uploadResults.map((result) => result.secure_url); // 이미지 URL만 추출

      // 2. 이미지 URL과 개시글 정보를 함께 저장
      return await this.usersService.updateUserProfilePicture(
        user.nickname,
        imageUrls,
      );
    } catch (e) {
      console.log('Error uploading image:', e);
      throw new BadRequestException('Failed to upload image');
    }

    // return this.usersService.updateUserProfilePicture(
    //   user.nickname,
    //   files ? files : undefined, // 만약 file이 undefined면 undefined 그대로 전달.
    // );
  }

  // @Get('follow/me')
  // async getFollow(
  //   @User() user: UsersModel,
  //   @Query('includeNotConfirmed', new DefaultValuePipe(false), ParseBoolPipe)
  //   includeNotConfirmed: boolean,
  // ) {
  //   return this.usersService.getFollowers(user.id, includeNotConfirmed);
  // }

  // @Post('follow/:id')
  // async postFollow(
  //   @User() user: UsersModel,
  //   @Param('id', ParseIntPipe) followeeId: number,
  // ) {
  //   await this.usersService.followUser(user.id, followeeId);
  //   return true;
  // }

  // @Patch('follow/:id/confirm') // :id -> 나를 팔로우 요청한 상대의 ID
  // async patchFollowConfirm(
  //   @User() user: UsersModel,
  //   @Param('id', ParseIntPipe) followerId: number,
  // ) {
  //   await this.usersService.confirmFollow(followerId, user.id);

  //   await this.usersService.incrementFollowerCount(user.id);
  //   await this.usersService.incrementFolloweeCount(followerId);

  //   return true;
  // }

  // @Delete('follow/:id') // :id --> 내가 팔로우 취소하고 싶은 상대의 ID
  // async deleteFollow(
  //   @User() user: UsersModel,
  //   @Param('id', ParseIntPipe) followeeId: number,
  // ) {
  //   await this.usersService.deleteFollow(user.id, followeeId);

  //   await this.usersService.decrementFollwerCount(followeeId);
  //   await this.usersService.decrementFolloweeCount(user.id);

  //   return true;
  // }

  /**
   *
   * Social Link 관련 API
   */
  @Get('mySocialLinks')
  getMySocialLinks(@User() user: UsersModel) {
    return this.usersService.getMySocialLinks(user);
  }

  @Post('socialLinks')
  createSocialLinks(
    @User() user: UsersModel,
    @Body() createSocialLinkDto: CreateSocialLinkDto,
  ) {
    return this.usersService.createSocialLinks(user, createSocialLinkDto);
  }

  @Patch('socialLinks/:socialLinkId')
  @UseGuards(IsSocialLinkMineOrAdminGuard)
  updateSocialLinks(
    @Param('socialLinkId', ParseIntPipe) socialLinkId: number,
    @User() user: UsersModel,
    @Body() updateSocialLinksDto: UpdateSocialLinksDto,
  ) {
    return this.usersService.updateSocialLinks(
      socialLinkId,
      user,
      updateSocialLinksDto,
    );
  }

  @Delete('socialLinks/:socialLinkId')
  @UseGuards(IsSocialLinkMineOrAdminGuard)
  deleteSocialLinks(
    @Param('socialLinkId', ParseIntPipe) socialLinkId: number,
    @User() user: UsersModel,
  ) {
    return this.usersService.deleteSocialLink(socialLinkId, user);
  }
}

import { UpdateSocialLinksDto } from './dto/update-socialLinks.dto';
/* eslint-disable prefer-const */
import { UpdateProfileDto } from './dto/update-profile.dto';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { SocialLinkModel } from './entity/social-link.entity';
import { CreateSocialLinkDto } from './dto/create-socialLink.dto';
import { MAX_SOCIAL_LINK } from './const/max.social.link';
import { CommonService } from 'src/common/common.service';
import { CloudinaryService } from 'src/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(SocialLinkModel)
    private readonly socialLinkRepository: Repository<SocialLinkModel>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
    // 1) nickname 중복 확인
    // exist() -> 만약에 조건에 해당되는 값이 있으면 true만환.
    const isNickname = await this.usersRepository.exist({
      where: { nickname: user.nickname },
    });

    if (isNickname) {
      throw new BadRequestException('400 BadRequest\nAlready Extant Nickname');
    }

    // 2) Email 중복 확인
    const isEmail = await this.usersRepository.exist({
      where: { email: user.email },
    });

    if (isEmail) {
      throw new BadRequestException('400 BadRequest\nAlready Extant Email');
    }

    const userObject = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    });

    const newUser = await this.usersRepository.save(userObject);

    return newUser;
  }

  async getAllUsers() {
    const users = await this.usersRepository.find();
    return users;
  }

  /**
   *
   * authService에서 사용할 userRepository 함수들.
   */

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email: email },
      relations: { posts: true, socialLinks: true },
      order: { socialLinks: { id: 'ASC' } },
    });
  }

  async getUserByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { nickname: username },
      relations: { posts: true, socialLinks: true },
      order: { socialLinks: { id: 'ASC' } },
    });
  }

  async CheckUserByNickname(username: string) {
    const result = await this.usersRepository.exists({
      where: { nickname: username },
    });
    return result;
  }

  /**
   *
   * User information 관련 API
   */

  async updateUserProfileInfo(
    user: UsersModel,
    updateProfileDto: UpdateProfileDto,
  ) {
    // 1) create -> 저장할 객체를 생성한다.
    // 2) save -> 객체를 저장한다.(create 메서드에서 생성한 객체로 저장)

    // updateProfileDto 구조분해할당
    const { bio, city } = updateProfileDto;

    // create() 함수는 동기식으로 처리됨.
    await this.usersRepository.update(
      {
        id: user.id,
      },
      { bio, city },
    );

    // await this.socialLinkRepository.create()

    const result = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: { posts: true, socialLinks: true },
    });

    return result;
  }

  async updateUserProfilePicture(nickname: string, images?: string[]) {
    // 1️⃣ 기존 사용자 정보 가져오기
    const user = await this.usersRepository.findOne({
      where: { nickname: nickname },
    });

    if (!user) {
      throw new BadRequestException('400 BadRequest\nUser Not Found');
    }

    // 기존 프로필 이미지 URL
    const oldImages = user.images;

    // 2️⃣ 새 프로필 이미지 저장
    await this.usersRepository.update(
      {
        nickname: nickname,
      },
      { images: images },
    );

    // 3️⃣ Cloudinary에서 기존 프로필 이미지 삭제(단, 깆혼 이미지가 존재할 경우)
    if (oldImages && oldImages.length > 0) {
      for (const imageUrl of oldImages) {
        const publicId = this.cloudinaryService.extractPublicId(imageUrl);
        await this.cloudinaryService.deleteImage(publicId);
      }
    }

    const result = await this.usersRepository.findOne({
      where: { nickname: nickname },
      relations: { posts: true },
    });

    return result;
  }

  /**
   *
   * Social Link 관련 API
   */
  async getMySocialLinks(user: UsersModel) {
    const result = await this.socialLinkRepository.find({
      where: { user: { id: user.id } },
      order: { id: 'ASC' },
    });

    if (result.length === 0) {
      return 'no Social Links';
    }

    return result;
  }

  async createSocialLinks(
    user: UsersModel,
    createSocialLinkDto: CreateSocialLinkDto,
  ) {
    const { title, url } = createSocialLinkDto;

    await this.checkSocialLinkCount(user.id);

    // 3. 개수 제한에 걸리지 않았다면, 새로운 Social Link 생성.
    const newSL = this.socialLinkRepository.create({
      title,
      url,
      user: { id: user.id },
    });

    return this.socialLinkRepository.save(newSL);
  }

  async updateSocialLinks(
    socialLinkId: number,
    user: UsersModel,
    updateSocialLinksDto: UpdateSocialLinksDto,
  ) {
    const { title, url } = updateSocialLinksDto;

    await this.checkSocialLinkCount(user.id);

    await this.socialLinkRepository.update(
      {
        user: { id: user.id },
        id: socialLinkId,
      },
      { title, url },
    );

    const result = await this.socialLinkRepository.findOne({
      where: { id: socialLinkId, user: { id: user.id } },
    });

    return result;
  }

  async deleteSocialLink(socialLinkId: number, user: UsersModel) {
    const result = await this.socialLinkRepository.delete({
      user: { id: user.id },
      id: socialLinkId,
    });

    return `${user.nickname}의 소셜링크 id: ${socialLinkId} 삭제완료.\n ${result.affected}개의 row 삭제됨.`;
  }

  // 자기자신의 Socail Link인지 아닌지 확인하는 API
  async isSocialLinkMine(socialLinkId: number, userId: number) {
    return this.socialLinkRepository.exists({
      where: { id: socialLinkId, user: { id: userId } },
      relations: { user: true },
    });
  }

  // 유저의 소셜링크 갯수 확인하는 함수
  async checkSocialLinkCount(userId: number) {
    // 1. 갯수제한 검사
    const links = await this.socialLinkRepository.find({
      where: {
        user: { id: userId },
      },
    });

    if (links.length > MAX_SOCIAL_LINK - 1) {
      throw new BadRequestException(
        `400 BadRequest\nSocial Links 는 최대 ${MAX_SOCIAL_LINK}개까지만 등록가능합니다.`,
      );
    }

    return true;
  }
}

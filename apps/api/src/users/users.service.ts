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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(SocialLinkModel)
    private readonly socialLinkRepository: Repository<SocialLinkModel>,
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

  async updateUserProfilePicture(
    nickname: string,
    images?: Array<Express.Multer.File>,
  ) {
    // 1) create -> 저장할 객체를 생성한다.
    // 2) save -> 객체를 저장한다.(create 메서드에서 생성한 객체로 저장)

    // files 배열에서 filename만 추출.
    const filenames = [];
    images.forEach((v) => {
      filenames.push(v.filename);
    });

    // create() 함수는 동기식으로 처리됨.
    await this.usersRepository.update(
      {
        nickname: nickname,
      },
      { images: filenames },
    );

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

    console.log(result);

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
}

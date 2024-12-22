import { PickType } from '@nestjs/mapped-types';
import { SocialLinkModel } from '../entity/social-link.entity';

export class CreateSocialLinkDto extends PickType(SocialLinkModel, [
  'title',
  'url',
]) {}

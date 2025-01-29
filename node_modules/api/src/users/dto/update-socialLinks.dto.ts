import { PickType } from '@nestjs/mapped-types';
import { SocialLinkModel } from '../entity/social-link.entity';

export class UpdateSocialLinksDto extends PickType(SocialLinkModel, [
  'title',
  'url',
]) {}

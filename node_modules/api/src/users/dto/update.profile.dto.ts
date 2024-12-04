import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from '../entity/users.entity';

export class UpdateProfileDto extends PickType(UsersModel, [
  'bio',
  'city',
  'socialLink',
]) {}

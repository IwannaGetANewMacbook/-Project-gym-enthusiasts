import { PickType } from '@nestjs/mapped-types';
import { UsersModel } from '../entity/users.entity';
import { IsOptional, IsString } from 'class-validator';

export class CreateGoogleUserDto extends PickType(UsersModel, [
  'email',
  'nickname',
]) {
  @IsOptional()
  @IsString()
  picture?: string;
}

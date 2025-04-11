import { IsString, Length } from 'class-validator';

export class UpdateNicknameDto {
  @IsString()
  @Length(1, 20)
  newNickname: string;
}

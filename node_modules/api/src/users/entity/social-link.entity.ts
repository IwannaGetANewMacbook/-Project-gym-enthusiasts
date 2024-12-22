import { IsString, IsUrl, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { UsersModel } from './users.entity';

@Entity()
export class SocialLinkModel extends BaseModel {
  @Column({ nullable: false })
  @IsString()
  @Length(1, 50)
  title: string; // 소셜 링크의 이름(e.g. "Facebook", "Instagram")

  @Column({ nullable: false })
  @IsUrl()
  url: string; // 소셜 링크의 URL

  @ManyToOne(() => UsersModel, (user) => user.socialLinks, {
    onDelete: 'CASCADE', // 유저 삭제 시 소셜링크도 삭제
  })
  user: UsersModel; // 소셜 링크가 속한 사용자
}

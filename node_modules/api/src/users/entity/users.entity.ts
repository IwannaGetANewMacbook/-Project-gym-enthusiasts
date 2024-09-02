import { Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { BaseModel } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';
import { RolesEnum } from '../const/roles.const';

@Entity()
export class UsersModel extends BaseModel {
  @Column()
  @Length(1, 20)
  nickname: string;

  @Column({ unique: true })
  @IsString()
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Length(3, 8)
  /**
   * Request
   * frontend -> backend 데이터 전송 시에는,
   * plain object (JSON) -> class instance (dto) 로 변환됨.
   *
   * Response
   * backend -> frontend 데이터 전송 시에는,
   * class instance (dto) -> plain object (JSON) 로 변환.
   *
   * toClassOnly -> class instance 변환될때만(즉, 요청을 보낼때만 적용)
   * toPlainOnly -> plain object로 변환될때만(즉, 응답을 보낼때만 적용)
   * @Exclude() 애노태이션을 옵션없이 사용하면 toClassOnly, toPlainOnly 모두 적용됨.
   *
   * request에서는 password를 제외시키지 말아야 하고 response에서만 제외시키고 싶음.
   */
  @Exclude({
    toPlainOnly: true, // 응답이 나가는 상황에서만 제외시키겠다.(요청에서는 제외안됨.)
  })
  password: string;

  @Column({ enum: Object.values(RolesEnum), default: RolesEnum.USER })
  role: RolesEnum;
}

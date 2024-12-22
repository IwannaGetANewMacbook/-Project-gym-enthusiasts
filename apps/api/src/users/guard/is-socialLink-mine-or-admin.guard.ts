import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RolesEnum } from 'src/users/const/roles.const';
import { UsersService } from '../users.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { Request } from 'express';

@Injectable()
export class IsSocialLinkMineOrAdminGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UsersModel;
    };

    const { user } = req;

    if (!user) {
      throw new UnauthorizedException('사용자 정보를 가져올 수 없음.');
    }

    // Admin일 경우 Guard bypass.
    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    // socialLinkId 가져오기
    const socialLinkId = req.params.socialLinkId;

    if (!socialLinkId || isNaN(parseInt(socialLinkId))) {
      throw new BadRequestException(
        'Social Link ID가 파라미터로 제공 되어야 합니다.',
      );
    }

    const isOk = await this.usersService.isSocialLinkMine(
      parseInt(socialLinkId),
      user.id,
    );

    if (!isOk) {
      throw new ForbiddenException('권한이 없거나 잘못된 socialLinkId 입니다.');
    }

    return true;
  }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '~/common/prisma/prisma.service';
import { UserUpdateDto } from './dto/user-update.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async updateUser(user: User, request: UserUpdateDto) {
    if (request.handle) {
      const exist = await this.prismaService.user.findUnique({
        where: {
          handle: request.handle,
        },
      });

      if (exist) {
        throw new ConflictException('handle already exists');
      }
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: request.username,
        handle: request.handle,
      },
    });
  }
}

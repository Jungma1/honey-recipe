import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from '../auth/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserUpdateDto } from './dto/user-update.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(@AuthUser() user: User, @Body() request: UserUpdateDto) {
    return this.userService.updateUser(user, request);
  }
}

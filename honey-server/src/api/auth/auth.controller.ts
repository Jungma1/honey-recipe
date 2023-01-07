import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUser } from './decorator/auth-user.decorator';
import { GoogleGuard } from './guard/google.guard';
import { OAuthUser } from './interface/oauth-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('oauth/google')
  @UseGuards(GoogleGuard)
  async google() {
    // oauth google
  }

  @Get('oauth/google/redirect')
  @UseGuards(GoogleGuard)
  async googleRedirect(@AuthUser() user: OAuthUser) {
    return user;
  }
}

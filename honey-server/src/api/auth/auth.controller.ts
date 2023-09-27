import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { AppConfigService } from '~/common/config/app-config.service';
import { clearTokenCookies, setTokenCookies } from '~/lib/cookies';
import { AuthService } from './auth.service';
import { AuthUser } from './decorator/auth-user.decorator';
import { AuthUserDto } from './dto/auth-user.dto';
import { GoogleGuard } from './guard/google.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { OAuthUser } from './interface/oauth-user.interface';

@Controller('auth')
export class AuthController {
  private readonly host: string;
  private readonly domain: string;

  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
  ) {
    this.host = appConfigService.host;
    this.domain = appConfigService.domain;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@AuthUser() user: User) {
    return new AuthUserDto(user);
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req: Request) {
    const tokens = req.user as { accessToken: string; refreshToken: string };
    return { ...tokens, domain: this.domain };
  }

  @Get('oauth/google')
  @UseGuards(GoogleGuard)
  async google() {
    return;
  }

  @Get('oauth/google/redirect')
  @UseGuards(GoogleGuard)
  async googleRedirect(@AuthUser() user: OAuthUser, @Res() res: Response) {
    const tokens = await this.authService.socialRegister(user);
    setTokenCookies(res, tokens, this.domain);
    return res.redirect(this.host);
  }

  @Get('oauth/:provider')
  async provider(@Param('provider') provider: string, @Res() res: Response) {
    const socialLink = await this.authService.generateSocialLink(provider);
    return res.redirect(socialLink);
  }

  @Get('oauth/:provider/redirect')
  async providerRedirect(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    const user = await this.authService.generateSocialUser(provider, code);
    const tokens = await this.authService.socialRegister(user);

    setTokenCookies(res, tokens, this.domain);
    return res.redirect(this.host);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    await this.authService.removeToken(refreshToken);
    clearTokenCookies(res, this.domain);
    return res.sendStatus(200);
  }
}

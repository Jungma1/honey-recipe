import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppConfigService } from '~/common/config/app-config.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];

    if (!accessToken && !refreshToken) next();

    if (!accessToken && refreshToken) {
      const { accessToken: freshAccessToken, refreshToken: freshRefreshToken } =
        await this.authService.refreshToken(refreshToken);

      res.cookie('access_token', freshAccessToken, {
        httpOnly: true,
        path: '/',
        domain: this.appConfigService.domain,
        maxAge: 60 * 60 * 1000,
      });
      res.cookie('refresh_token', freshRefreshToken, {
        httpOnly: true,
        path: '/',
        domain: this.appConfigService.domain,
        maxAge: 60 * 60 * 1000 * 24 * 7,
      });

      req.cookies['access_token'] = freshAccessToken;
    }
    next();
  }
}

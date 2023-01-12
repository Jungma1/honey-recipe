import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppConfigService } from '~/common/config/app-config.service';
import { setTokenCookies } from '~/lib/cookies';
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

    if (!accessToken && !refreshToken) {
      return next();
    }

    if (!accessToken && refreshToken) {
      const tokens = await this.authService.refreshToken(refreshToken);
      const domain = this.appConfigService.domain;

      setTokenCookies(res, tokens, domain);

      req.cookies['access_token'] = tokens.accessToken;
    }
    next();
  }
}

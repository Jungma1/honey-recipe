import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppConfigService } from '~/common/config/app-config.service';
import { setTokenCookies } from '~/lib/cookies';
import { AuthService } from './auth.service';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  TokenService,
} from './token.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken =
      req.cookies['access_token'] ?? req.headers.authorization?.split(' ')[1];
    const refreshToken = req.cookies['refresh_token'];

    if (!accessToken && !refreshToken) {
      req.user = {
        id: null,
      };
      return next();
    }

    if (accessToken) {
      const { userId } =
        await this.tokenService.verifyToken<AccessTokenPayload>(accessToken);
      req.user = {
        id: userId,
      };
      req.headers.authorization = `Bearer ${accessToken}`;
    }

    if (!accessToken && refreshToken) {
      const { tokenId, counter } =
        await this.tokenService.verifyToken<RefreshTokenPayload>(refreshToken);
      const tokens = await this.authService.refreshToken(tokenId, counter);
      const domain = this.appConfigService.domain;

      setTokenCookies(res, tokens, domain);

      const { userId } =
        await this.tokenService.verifyToken<AccessTokenPayload>(
          tokens.accessToken,
        );
      req.user = {
        id: userId,
      };

      req.headers.authorization = `Bearer ${tokens.accessToken}`;
    }
    next();
  }
}

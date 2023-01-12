import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface AccessTokenPayload {
  type: 'access_token';
  userId: number;
  tokenId: number;
}

export interface RefreshTokenPayload {
  type: 'refresh_token';
  tokenId: number;
  counter: number;
}

type TokensPayload = AccessTokenPayload | RefreshTokenPayload;

type DecodedToken<T> = T & { iat: number; exp: number };

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: TokensPayload) {
    const tokensExpiresIn = {
      access_token: '1h',
      refresh_token: '7d',
    } as const;

    try {
      return this.jwtService.sign(payload, {
        expiresIn: tokensExpiresIn[payload.type],
      });
    } catch (e) {
      throw new InternalServerErrorException('Token generation failed');
    }
  }

  async verifyToken<T extends TokensPayload>(token: string) {
    return this.jwtService.verify<DecodedToken<T>>(token);
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AccessTokenPayload {
  type: 'access_token';
  userId: number;
  tokenId: number;
}

interface RefreshTokenPayload {
  type: 'refresh_token';
  tokenId: number;
  counter: number;
}

type TokensPayload = AccessTokenPayload | RefreshTokenPayload;

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: TokensPayload) {
    const tokensExpiresIn = {
      access_token: '1h',
      refresh_token: '30d',
    } as const;

    try {
      return this.jwtService.sign(payload, {
        expiresIn: tokensExpiresIn[payload.type],
      });
    } catch (e) {
      throw new InternalServerErrorException('Token generation failed');
    }
  }
}

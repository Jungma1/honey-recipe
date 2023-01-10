import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '~/common/prisma/prisma.service';

export interface Payload {
  userId: number;
}

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const accessToken = request.cookies['access_token'];
          return accessToken;
        },
      ]),
    });
  }

  async validate(payload: Payload) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    return user;
  }
}

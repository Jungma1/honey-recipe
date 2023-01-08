import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '~/prisma/prisma.service';
import { OAuthUser } from './interface/oauth-user.interface';
import { JwtAuthService } from './jwt-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async socialRegister(user: OAuthUser) {
    let findUser = await this.prismaService.user.findFirst({
      where: {
        socialAccount: {
          provider: user.provider,
          socialId: user.socialId,
        },
      },
    });

    try {
      if (!findUser) {
        findUser = await this.prismaService.user.create({
          data: {
            email: user.email,
            username: user.username,
            picture: user.picture,
            socialAccount: {
              create: {
                provider: user.provider,
                socialId: user.socialId,
              },
            },
          },
        });
      }

      const token = await this.prismaService.token.create({
        data: {
          userId: findUser.id,
        },
      });

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtAuthService.generateToken({
          type: 'access_token',
          userId: findUser.id,
          tokenId: token.id,
        }),
        this.jwtAuthService.generateToken({
          type: 'refresh_token',
          tokenId: token.id,
          counter: token.counter,
        }),
      ]);

      return { accessToken, refreshToken };
    } catch (e) {
      throw new InternalServerErrorException('Social login failed');
    }
  }
}

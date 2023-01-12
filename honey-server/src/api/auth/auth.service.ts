import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Token, User } from '@prisma/client';
import { PrismaService } from '~/common/prisma/prisma.service';
import { OAuthUser } from './interface/oauth-user.interface';
import { RefreshTokenPayload, TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
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

      return this.generateTokens(findUser, token);
    } catch (e) {
      throw new InternalServerErrorException('Social login failed');
    }
  }

  async refreshToken(token: string) {
    try {
      const { tokenId, counter } =
        await this.tokenService.verifyToken<RefreshTokenPayload>(token);

      const findToken = await this.prismaService.token.findUnique({
        where: {
          id: tokenId,
        },
      });

      if (!findToken) {
        throw new Error('Token is not found');
      }

      if (findToken.invalidate) {
        throw new Error('Token is invalidate');
      }

      if (findToken.counter !== counter) {
        await this.prismaService.token.update({
          where: {
            id: findToken.id,
          },
          data: {
            invalidate: true,
          },
        });

        throw new Error('Refresh Token rotation counter does not match');
      }

      const updatedToken = await this.prismaService.token.update({
        where: {
          id: findToken.id,
        },
        data: {
          counter: findToken.counter + 1,
        },
        include: {
          user: true,
        },
      });

      return this.generateTokens(updatedToken.user, updatedToken);
    } catch (e) {
      throw new UnauthorizedException(e.message ?? 'Token refresh failed');
    }
  }

  private async generateTokens(user: User, token: Token) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateToken({
        type: 'access_token',
        userId: user.id,
        tokenId: token.id,
      }),
      this.tokenService.generateToken({
        type: 'refresh_token',
        tokenId: token.id,
        counter: token.counter,
      }),
    ]);

    return { accessToken, refreshToken };
  }
}

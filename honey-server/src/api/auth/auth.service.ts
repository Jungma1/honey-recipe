import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Token, User } from '@prisma/client';
import axios from 'axios';
import { AppConfigService } from '~/common/config/app-config.service';
import { FileService } from '~/common/file/file.service';
import { PrismaService } from '~/common/prisma/prisma.service';
import { OAuthUser } from './interface/oauth-user.interface';
import { RefreshTokenPayload, TokenService } from './token.service';

interface NaverProfile {
  response: {
    id: string;
    email: string;
    nickname: string;
    profile_image: string;
  };
}

interface KakaoProfile {
  id: number;
  kakao_account: {
    email: string;
    profile: {
      nickname: string;
      profile_image_url: string;
    };
  };
}

@Injectable()
export class AuthService {
  private readonly OAUTH_NAVER_ID: string;
  private readonly OAUTH_NAVER_SECRET: string;
  private readonly OAUTH_KAKAO_ID: string;
  private readonly OAUTH_KAKAO_SECRET: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly appConfigService: AppConfigService,
    private readonly fileService: FileService,
  ) {
    this.OAUTH_NAVER_ID = configService.get<string>('OAUTH_NAVER_ID');
    this.OAUTH_NAVER_SECRET = configService.get<string>('OAUTH_NAVER_SECRET');
    this.OAUTH_KAKAO_ID = configService.get<string>('OAUTH_KAKAO_ID');
    this.OAUTH_KAKAO_SECRET = configService.get<string>('OAUTH_KAKAO_SECRET');
  }

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
            socialAccount: {
              create: {
                provider: user.provider,
                socialId: user.socialId,
              },
            },
          },
        });

        const { buffer, extension } = await this.fileService.generateFile(
          user.picture,
        );

        const key = await this.fileService.generateKey({
          id: findUser.id,
          type: 'avatars',
          extension: extension || 'png',
        });

        await this.fileService.uploadFile(key, buffer);

        await this.prismaService.user.update({
          where: {
            id: findUser.id,
          },
          data: {
            picture: `https://cdn.kkulpi.com/${key}`,
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

  async removeToken(token: string) {
    try {
      const { tokenId } =
        await this.tokenService.verifyToken<RefreshTokenPayload>(token);
      await this.prismaService.token.delete({ where: { id: tokenId } });
    } catch (e) {
      throw new InternalServerErrorException('Logout failed');
    }
  }

  async generateSocialLink(provider: string): Promise<string> {
    const providers = ['naver', 'kakao'];
    const validated = providers.includes(provider);

    if (!validated) {
      throw new BadRequestException('Not found provider');
    }

    const host = this.appConfigService.apiHost;
    const redirectUri = `${host}/api/v1/auth/oauth/${provider}/redirect`;

    const socials = {
      naver: `https://nid.naver.com/oauth2.0/authorize?&client_id=${this.OAUTH_NAVER_ID}&response_type=code&redirect_uri=${redirectUri}&state=/`,
      kakao: `https://kauth.kakao.com/oauth/authorize?client_id=${this.OAUTH_KAKAO_ID}&response_type=code&redirect_uri=${redirectUri}`,
    } as const;

    return socials[provider];
  }

  async generateSocialUser(provider: string, code: string): Promise<OAuthUser> {
    switch (provider) {
      case 'naver': {
        return this.getNaverProfile(code);
      }
      case 'kakao': {
        return this.getKakaoProfile(code);
      }
      default: {
        throw new BadRequestException('Not found provider');
      }
    }
  }

  private async getNaverProfile(code: string): Promise<OAuthUser> {
    try {
      const {
        data: { access_token: accessToken },
      } = await axios.get<{ access_token: string }>(
        `https://nid.naver.com/oauth2.0/token?client_id=${this.OAUTH_NAVER_ID}&client_secret=${this.OAUTH_NAVER_SECRET}&grant_type=authorization_code&state=/&code=${code}`,
      );

      const { data: profile } = await axios.get<NaverProfile>(
        'https://openapi.naver.com/v1/nid/me',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const { email, nickname, profile_image, id } = profile.response;

      const user: OAuthUser = {
        email,
        username: nickname,
        picture: profile_image,
        provider: 'naver',
        socialId: id,
      };

      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async getKakaoProfile(code: string) {
    try {
      const host = this.appConfigService.apiHost;
      const redirectUri = `${host}/api/v1/auth/oauth/kakao/redirect`;

      const {
        data: { access_token: accessToken },
      } = await axios.post<{ access_token: string }>(
        `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${this.OAUTH_KAKAO_ID}&redirect_uri=${redirectUri}&client_secret=${this.OAUTH_KAKAO_SECRET}&code=${code}`,
      );

      const { data: profile } = await axios.get<KakaoProfile>(
        'https://kapi.kakao.com/v2/user/me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const user: OAuthUser = {
        email: profile.kakao_account.email,
        username: profile.kakao_account.profile.nickname,
        picture: profile.kakao_account.profile.profile_image_url,
        provider: 'kakao',
        socialId: `${profile.id}`,
      };

      return user;
    } catch (e) {
      throw new UnauthorizedException();
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

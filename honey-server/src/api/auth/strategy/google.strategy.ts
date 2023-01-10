import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { OAuthUser } from '../interface/oauth-user.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get('OAUTH_GOOGLE_ID'),
      clientSecret: configService.get('OAUTH_GOOGLE_SECRET'),
      callbackURL: configService.get('OAUTH_GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const { id, provider, displayName, emails, photos } = profile;

    const user: OAuthUser = {
      email: emails[0].value,
      username: displayName,
      picture: photos[0].value,
      provider,
      socialId: id,
    };

    return user;
  }
}

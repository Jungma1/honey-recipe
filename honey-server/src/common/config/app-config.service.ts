import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  private readonly NODE_ENV: string;

  constructor(private readonly configService: ConfigService) {
    this.NODE_ENV = configService.get('NODE_ENV');
  }

  get host() {
    return this.NODE_ENV === 'production'
      ? 'https://kkulpi.com'
      : 'http://localhost:3000';
  }

  get apiHost() {
    return this.NODE_ENV === 'production'
      ? 'https://api.kkulpi.com'
      : 'http://localhost:4000';
  }

  get domain() {
    return this.NODE_ENV === 'production' ? '.kkulpi.com' : undefined;
  }
}

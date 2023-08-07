import { Module } from '@nestjs/common';
import { FileModule } from '~/common/file/file.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { TokenModule } from './token.module';

@Module({
  imports: [TokenModule, FileModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthStrategy,
    GoogleStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}

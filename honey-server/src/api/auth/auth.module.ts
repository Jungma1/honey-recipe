import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthModule } from './jwt-auth.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';

@Module({
  imports: [JwtAuthModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy, GoogleStrategy],
})
export class AuthModule {}

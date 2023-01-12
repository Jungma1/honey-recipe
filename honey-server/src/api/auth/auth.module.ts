import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtAuthStrategy } from './strategy/jwt-auth.strategy';
import { TokenModule } from './token.module';

@Module({
  imports: [TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}

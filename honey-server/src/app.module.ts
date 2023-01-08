import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { AppConfigModule } from './config/app-config.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AppConfigModule, PrismaModule, AuthModule],
})
export class AppModule {}

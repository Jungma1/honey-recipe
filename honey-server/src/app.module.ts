import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { AppConfigModule } from './common/config/app-config.module';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [AppConfigModule, PrismaModule, AuthModule],
})
export class AppModule {}

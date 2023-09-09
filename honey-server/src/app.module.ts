import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthMiddleware } from './api/auth/auth.middleware';
import { AuthModule } from './api/auth/auth.module';
import { TokenModule } from './api/auth/token.module';
import { BookmarkModule } from './api/bookmark/bookmark.module';
import { RecipeModule } from './api/recipe/recipe.module';
import { UserModule } from './api/user/user.module';
import { AppConfigModule } from './common/config/app-config.module';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    TokenModule,
    AuthModule,
    RecipeModule,
    UserModule,
    BookmarkModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('api/v1/auth/oauth/(.*)')
      .forRoutes('/');
  }
}

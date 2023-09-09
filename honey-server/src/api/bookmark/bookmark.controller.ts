import {
  Controller,
  DefaultValuePipe,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from '../auth/decorator/auth-user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { BookmarkService } from './bookmark.service';

@Controller('bookmarks')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('size', new DefaultValuePipe(10)) size: number,
    @AuthUser() user: User,
  ) {
    return this.bookmarkService.findBookmarks(page, size, user);
  }
}

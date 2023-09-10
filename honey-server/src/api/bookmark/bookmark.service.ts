import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '~/common/prisma/prisma.service';
import { Page } from '~/lib/page';
import { RecipeResponseDto } from '../recipe/dto/recipe-response.dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly prismaService: PrismaService) {}

  async findBookmarks(page: number, size: number, user: User) {
    const [totalCount, bookmarks] = await Promise.all([
      this.prismaService.recipeBookmark.count({
        where: {
          userId: user.id,
        },
      }),
      this.prismaService.recipeBookmark.findMany({
        select: {
          recipe: {
            include: {
              user: true,
              recipeStat: true,
            },
          },
        },
        where: {
          userId: user.id,
        },
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const recipes = bookmarks.map(
      (bookmark) => new RecipeResponseDto(bookmark.recipe),
    );
    return new Page(totalCount, page, size, recipes);
  }
}

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
      this.prismaService.recipe.findMany({
        include: {
          user: true,
          recipeStat: true,
        },
        where: {
          recipeBookmark: {
            every: {
              userId: user.id,
            },
          },
        },
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const result = bookmarks.map((bookmark) => new RecipeResponseDto(bookmark));
    return new Page(totalCount, page, size, result);
  }
}

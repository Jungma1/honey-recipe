import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as mimeTypes from 'mime-types';
import { FileService } from '~/common/file/file.service';
import { PrismaService } from '~/common/prisma/prisma.service';
import { Page } from '~/lib/page';
import { RecipeCreateRequestDto } from './dto/recipe-create-request.dto';
import { RecipeCreateResponseDto } from './dto/recipe-create-response.dto';
import { RecipeReadResponseDto } from './dto/recipe-read-response.dto';
import { RecipeResponseDto } from './dto/recipe-response.dto';
import { RecipeUpdateRequestDto } from './dto/recipe-update-request.dto';

@Injectable()
export class RecipeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async findAll(page: number, size: number, mode: string) {
    if (mode === 'recent') {
      return this.findRecentRecipes(page, size);
    }

    if (['daily', 'weekly', 'monthly'].includes(mode)) {
      return this.findPopularRecipes(page, size, mode);
    }
  }

  private async findRecentRecipes(page: number, size: number) {
    const [totalCount, recipes] = await Promise.all([
      await this.prismaService.recipe.count(),
      await this.prismaService.recipe.findMany({
        include: {
          user: true,
          recipeStat: true,
        },
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const result = recipes.map((recipe) => new RecipeResponseDto(recipe));
    return new Page(totalCount, page, size, result);
  }

  private async findPopularRecipes(page: number, size: number, mode: string) {
    const date = new Date();

    if (mode === 'daily') {
      date.setDate(date.getDate() - 1);
    }

    if (mode === 'weekly') {
      date.setDate(date.getDate() - 7);
    }

    if (mode === 'monthly') {
      date.setMonth(date.getMonth() - 1);
    }

    const [totalCount, recipes] = await Promise.all([
      await this.prismaService.recipe.count({
        where: {
          createdAt: {
            gte: date,
          },
        },
      }),
      await this.prismaService.recipe.findMany({
        include: {
          user: true,
          recipeStat: true,
        },
        skip: (page - 1) * size,
        take: size,
        where: {
          createdAt: {
            gte: date,
          },
        },
        orderBy: {
          recipeStat: {
            likeCount: 'desc',
          },
        },
      }),
    ]);

    const result = recipes.map((recipe) => new RecipeResponseDto(recipe));
    return new Page(totalCount, page, size, result);
  }

  async findOne(id: number) {
    const recipe = await this.prismaService.recipe.findUnique({
      include: {
        user: true,
        recipeStat: true,
        recipeCourse: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      where: { id },
    });

    return new RecipeReadResponseDto(recipe);
  }

  async createRecipe(
    user: User,
    request: RecipeCreateRequestDto,
    thumbnail: Express.Multer.File,
  ) {
    const recipeId = await this.prismaService.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          title: request.title,
          description: request.description,
          userId: user.id,
        },
      });

      await tx.recipeStat.create({
        data: {
          recipeId: recipe.id,
        },
      });

      if (thumbnail) {
        const key = await this.fileService.generateKey({
          id: recipe.id,
          type: 'recipes',
          extension: mimeTypes.extension(thumbnail.mimetype) || 'png',
        });

        await this.fileService.uploadFile(key, thumbnail.buffer);

        const thumbnailUrl = await this.fileService.generateUrl(key);

        await tx.recipe.update({
          where: {
            id: recipe.id,
          },
          data: {
            thumbnail: thumbnailUrl,
          },
        });
      }

      return recipe.id;
    });

    return new RecipeCreateResponseDto(recipeId);
  }

  async updateRecipe(id: number, user: User, request: RecipeUpdateRequestDto) {
    await this.validateRecipe(id, user.id);

    await this.prismaService.$transaction(async (tx) => {
      await this.prismaService.recipe.update({
        where: { id },
        data: {
          title: request.title,
          description: request.description,
          thumbnail: request.thumbnail,
        },
      });

      const course = request.course;

      if (course.length === 0) {
        await tx.recipeCourse.deleteMany({
          where: {
            recipeId: id,
          },
        });
      }

      if (course.length > 0) {
        await tx.recipeCourse.deleteMany({
          where: {
            recipeId: id,
            NOT: {
              id: {
                in: course
                  .filter((item) => item.created)
                  .map((item) => item.id),
              },
            },
          },
        });

        for (const [index, item] of course.entries()) {
          if (!item.created) {
            await tx.recipeCourse.create({
              data: {
                recipeId: id,
                content: item.content,
                picture: item.picture,
                order: index,
              },
            });
            continue;
          }

          await tx.recipeCourse.update({
            where: { id: item.id },
            data: {
              content: item.content,
              picture: item.picture,
              order: index,
            },
          });
        }
      }
    });
  }

  async deleteRecipe(id: number, user: User) {
    await this.validateRecipe(id, user.id);

    await this.prismaService.recipe.delete({
      where: { id },
    });
  }

  async uploadImage(id: number, user: User, image: Express.Multer.File) {
    await this.validateRecipe(id, user.id);

    const key = await this.fileService.generateKey({
      id,
      type: 'recipes',
      extension: mimeTypes.extension(image.mimetype) || 'png',
    });

    await this.fileService.uploadFile(key, image.buffer);

    const imagePath = await this.fileService.generateUrl(key);
    return { imagePath };
  }

  private async validateRecipe(id: number, userId: number) {
    const recipe = await this.prismaService.recipe.findUnique({
      where: { id },
    });

    if (recipe === null) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.userId !== userId) {
      throw new ForbiddenException('You are not allowed');
    }
  }
}

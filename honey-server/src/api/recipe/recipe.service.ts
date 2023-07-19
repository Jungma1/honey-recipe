import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as mimeTypes from 'mime-types';
import { FileService } from '~/common/file/file.service';
import { PrismaService } from '~/common/prisma/prisma.service';
import { RecipeCreateRequestDto } from './dto/recipe-create-request.dto';
import { RecipeCreateResponseDto } from './dto/recipe-create-response.dto';
import { RecipeResponseDto } from './dto/recipe-response.dto';
import { RecipeUpdateRequestDto } from './dto/recipe-update-request.dto';

@Injectable()
export class RecipeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
  ) {}

  async findOne(id: number) {
    const recipe = await this.prismaService.recipe.findUnique({
      include: {
        user: true,
        recipeStat: true,
      },
      where: { id },
    });

    return new RecipeResponseDto(recipe);
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

    await this.prismaService.recipe.update({
      where: { id },
      data: {
        title: request.title,
        description: request.description,
      },
    });
  }

  async deleteRecipe(id: number, user: User) {
    await this.validateRecipe(id, user.id);

    await this.prismaService.recipe.delete({
      where: { id },
    });
  }

  async updateRecipeThumbnail(
    id: number,
    user: User,
    thumbnail: Express.Multer.File,
  ) {
    await this.validateRecipe(id, user.id);

    const updatedRecipe = await this.prismaService.$transaction(async (tx) => {
      const key = await this.fileService.generateKey({
        id,
        type: 'recipes',
        extension: mimeTypes.extension(thumbnail.mimetype) || 'png',
      });

      await this.fileService.uploadFile(key, thumbnail.buffer);

      const thumbnailUrl = await this.fileService.generateUrl(key);

      return tx.recipe.update({
        where: { id },
        data: {
          thumbnail: thumbnailUrl,
        },
      });
    });

    return {
      thumbnail: updatedRecipe.thumbnail,
    };
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

  private async validateRecipeCourse(id: number) {
    const recipeCourse = await this.prismaService.recipeCourse.findUnique({
      where: { id },
    });

    if (recipeCourse === null) {
      throw new NotFoundException('Recipe Course not found');
    }
    return recipeCourse;
  }
}

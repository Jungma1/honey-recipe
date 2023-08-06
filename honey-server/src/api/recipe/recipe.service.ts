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
import { RecipeCommentCreateRequestDto } from './dto/recipe-comment-create-request.dto';
import { RecipeCommentResponseDto } from './dto/recipe-comment-response.dto';
import { RecipeCommentUpdateRequestDto } from './dto/recipe-comment-update-request.dto';
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

    if (['daily', 'weekly', 'monthly', 'yearly'].includes(mode)) {
      return this.findPopularRecipes(page, size, mode);
    }
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

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return new RecipeReadResponseDto(recipe);
  }

  async createRecipe(user: User, request: RecipeCreateRequestDto) {
    const recipeId = await this.prismaService.$transaction(async (tx) => {
      const recipe = await tx.recipe.create({
        data: {
          title: request.title,
          description: request.description,
          thumbnail: request.thumbnail,
          userId: user.id,
        },
      });

      await tx.recipeStat.create({
        data: {
          recipeId: recipe.id,
        },
      });

      for (const [index, item] of request.course.entries()) {
        await tx.recipeCourse.create({
          data: {
            recipeId: recipe.id,
            content: item.content,
            picture: item.picture,
            order: index,
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

  async uploadImage(user: User, image: Express.Multer.File) {
    const key = await this.fileService.generateKey({
      id: user.id,
      type: 'recipe',
      extension: mimeTypes.extension(image.mimetype) || 'png',
    });

    await this.fileService.uploadFile(key, image.buffer);

    const imagePath = await this.fileService.generateUrl(key);
    return { imagePath };
  }

  async findComments(id: number) {
    const comments = await this.prismaService.recipeComment.findMany({
      include: {
        user: true,
        mentionUser: true,
      },
      where: {
        recipeId: id,
        parentCommentId: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return comments.map((comment) => new RecipeCommentResponseDto(comment));
  }

  async findSubComments(id: number, commentId: number) {
    const comments = await this.prismaService.recipeComment.findMany({
      include: {
        user: true,
        mentionUser: true,
      },
      where: {
        recipeId: id,
        parentCommentId: commentId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return comments.map((comment) => new RecipeCommentResponseDto(comment));
  }

  async createComment(
    id: number,
    user: User,
    request: RecipeCommentCreateRequestDto,
  ) {
    await this.prismaService.$transaction(async (tx) => {
      const recipe = await tx.recipe.findUnique({
        where: { id },
      });

      if (!recipe) {
        throw new NotFoundException('Recipe not found');
      }

      if (!request.targetCommentId) {
        await tx.recipeComment.create({
          data: {
            recipeId: id,
            userId: user.id,
            parentCommentId: null,
            mentionUserId: null,
            content: request.content,
          },
        });
      } else {
        const parentComment = await tx.recipeComment.findUnique({
          where: {
            id: request.targetCommentId,
          },
        });

        if (!parentComment) {
          throw new NotFoundException('Parent comment not found');
        }

        const isParentCommentId = !!parentComment.parentCommentId;
        const parentCommentId = isParentCommentId
          ? parentComment.parentCommentId
          : parentComment.id;
        const mentionUserId = isParentCommentId ? parentComment.userId : null;

        await tx.recipeComment.create({
          data: {
            recipeId: id,
            userId: user.id,
            parentCommentId,
            mentionUserId,
            content: request.content,
          },
        });

        await tx.recipeComment.update({
          where: {
            id: parentCommentId,
          },
          data: {
            replyCount: {
              increment: 1,
            },
          },
        });
      }

      await tx.recipeStat.update({
        where: {
          recipeId: id,
        },
        data: {
          commentCount: {
            increment: 1,
          },
        },
      });
    });
  }

  async updateComment(
    commentId: number,
    user: User,
    request: RecipeCommentUpdateRequestDto,
  ) {
    await this.validateRecipeComment(commentId, user.id);

    await this.prismaService.recipeComment.update({
      where: {
        id: commentId,
      },
      data: {
        content: request.content,
      },
    });
  }

  async deleteComment(id: number, commentId: number, user: User) {
    await this.validateRecipeComment(commentId, user.id);

    await this.prismaService.$transaction(async (tx) => {
      let totalCount = 0;

      const deletedComment = await tx.recipeComment.delete({
        where: {
          id: commentId,
        },
      });

      if (deletedComment.parentCommentId) {
        await tx.recipeComment.update({
          where: {
            id: deletedComment.parentCommentId,
          },
          data: {
            replyCount: {
              decrement: 1,
            },
          },
        });
        totalCount++;
      }

      if (!deletedComment.parentCommentId) {
        const { count } = await tx.recipeComment.deleteMany({
          where: {
            parentCommentId: deletedComment.id,
          },
        });
        totalCount += count + 1;
      }

      await tx.recipeStat.update({
        where: {
          recipeId: id,
        },
        data: {
          commentCount: {
            decrement: totalCount,
          },
        },
      });
    });
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

  private async validateRecipeComment(id: number, userId: number) {
    const comment = await this.prismaService.recipeComment.findUnique({
      where: { id },
    });

    if (comment === null) {
      throw new NotFoundException('Recipe comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('You are not allowed');
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

    if (mode === 'yearly') {
      date.setFullYear(date.getFullYear(), 0, 2);
      date.setHours(0, 0, 0, 0);
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
}

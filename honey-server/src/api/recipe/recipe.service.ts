import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '~/common/prisma/prisma.service';
import { RecipeCourseUpdateDto } from './dto/recipe-course-update.dto';
import { RecipeCreateDto } from './dto/recipe-create.dto';
import { RecipeResponseDto } from './dto/recipe-response.dto';
import { RecipeUpdateDto } from './dto/recipe-update.dto';

@Injectable()
export class RecipeService {
  constructor(private readonly prismaService: PrismaService) {}

  async createRecipe(user: User, request: RecipeCreateDto) {
    await this.validateRecipeType(request.recipeTypeId);

    const recipe = await this.prismaService.recipe.create({
      data: {
        title: request.title,
        description: request.description,
        userId: user.id,
        recipeTypeId: request.recipeTypeId,
      },
    });

    await this.prismaService.recipeStat.create({
      data: {
        recipeId: recipe.id,
      },
    });

    const findRecipe = await this.prismaService.recipe.findUnique({
      include: {
        user: true,
        recipeStat: true,
        recipeType: true,
      },
      where: {
        id: recipe.id,
      },
    });

    return new RecipeResponseDto(findRecipe);
  }

  async updateRecipe(id: number, user: User, request: RecipeUpdateDto) {
    await this.validateRecipeType(request.recipeTypeId);
    await this.validateRecipe(id, user.id);

    await this.prismaService.recipe.update({
      where: {
        id,
      },
      data: {
        title: request.title,
        description: request.description,
        recipeTypeId: request.recipeTypeId,
      },
    });
  }

  async deleteRecipe(id: number, user: User) {
    await this.validateRecipe(id, user.id);

    await this.prismaService.recipe.delete({
      where: { id },
    });
  }

  async addCourse(id: number, user: User) {
    await this.validateRecipe(id, user.id);

    const count = await this.prismaService.recipeCourse.count({
      where: {
        recipeId: id,
      },
    });

    await this.prismaService.recipeCourse.create({
      data: {
        recipeId: id,
        order: count + 1,
        title: '',
        content: '',
      },
    });
  }

  async updateCourse(
    id: number,
    courseId: number,
    user: User,
    request: RecipeCourseUpdateDto,
  ) {
    await this.validateRecipe(id, user.id);
    await this.validateRecipeCourse(courseId);

    await this.prismaService.recipeCourse.update({
      where: {
        id: courseId,
      },
      data: {
        title: request.title,
        content: request.content,
      },
    });
  }

  async deleteCourse(id: number, courseId: number, user: User) {
    await this.validateRecipe(id, user.id);
    await this.validateRecipeCourse(courseId);

    const deletedRecipeCourse = await this.prismaService.recipeCourse.delete({
      where: {
        id: courseId,
      },
    });

    await this.prismaService.recipeCourse.updateMany({
      where: {
        recipeId: id,
        order: {
          gt: deletedRecipeCourse.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });
  }

  async updateCourseOrder(
    id: number,
    courseId: number,
    targetId: number,
    user: User,
  ) {
    await this.validateRecipe(id, user.id);

    const { order } = await this.validateRecipeCourse(courseId);
    const { order: targetOrder } = await this.validateRecipeCourse(targetId);

    await this.prismaService.$transaction(async (tx) => {
      await tx.recipeCourse.updateMany({
        where: {
          recipeId: id,
          AND: {
            order: {
              gte: Math.min(order, targetOrder),
              lte: Math.max(order, targetOrder),
            },
            NOT: {
              id: courseId,
            },
          },
        },
        data: {
          order: order < targetOrder ? { decrement: 1 } : { increment: 1 },
        },
      });

      await tx.recipeCourse.update({
        where: {
          id: courseId,
        },
        data: {
          order: targetOrder,
        },
      });
    });
  }

  private async validateRecipeType(id: number) {
    const recipeType = await this.prismaService.recipeType.findUnique({
      where: { id },
    });

    if (recipeType === null) {
      throw new NotFoundException('Recipe type not found');
    }
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

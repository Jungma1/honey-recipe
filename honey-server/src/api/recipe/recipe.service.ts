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
    const recipeType = await this.prismaService.recipeType.findUnique({
      where: { id: request.recipeTypeId },
    });

    if (recipeType === null) {
      throw new NotFoundException('Recipe type not found');
    }

    const recipe = await this.prismaService.recipe.create({
      data: {
        title: request.title,
        description: request.description,
        userId: user.id,
        recipeTypeId: recipeType.id,
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

  async updateRecipe(id: number, request: RecipeUpdateDto) {
    const recipeType = await this.prismaService.recipeType.findFirst({
      where: {
        id: request.recipeTypeId,
      },
    });

    if (recipeType === null) {
      throw new NotFoundException('Recipe type not found');
    }

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

  async deleteRecipe(id: number) {
    const recipe = await this.prismaService.recipe.findUnique({
      where: { id },
    });

    if (recipe === null) {
      throw new NotFoundException('Recipe not found');
    }

    await this.prismaService.recipe.delete({
      where: { id },
    });
  }

  async addCourse(id: number) {
    const recipe = await this.prismaService.recipe.findUnique({
      where: { id },
    });

    if (recipe === null) {
      throw new NotFoundException('Recipe not found');
    }

    const count = await this.prismaService.recipeCourse.count({
      where: {
        recipeId: recipe.id,
      },
    });

    await this.prismaService.recipeCourse.create({
      data: {
        recipeId: recipe.id,
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
    const recipe = await this.prismaService.recipe.findUnique({
      where: { id },
    });

    if (recipe === null) {
      throw new NotFoundException('Recipe not found');
    }

    if (recipe.userId !== user.id) {
      throw new ForbiddenException('Forbidden');
    }

    const recipeCourse = await this.prismaService.recipeCourse.findUnique({
      where: { id: courseId },
    });

    if (recipeCourse === null) {
      throw new NotFoundException('Recipe Course not found');
    }

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
}

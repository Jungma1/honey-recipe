import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '~/common/prisma/prisma.service';
import { RecipeCreateDto } from './dto/recipe-create.dto';
import { RecipeResponseDto } from './dto/recipe-response.dto';

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
}

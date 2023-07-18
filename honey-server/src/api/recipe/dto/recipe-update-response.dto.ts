import { Recipe } from '@prisma/client';

export class RecipeUpdateResponseDto {
  title: string;
  description: string;

  constructor(recipe: Recipe) {
    this.title = recipe.title;
    this.description = recipe.description;
  }
}

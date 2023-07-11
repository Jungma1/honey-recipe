import { RecipeType } from '@prisma/client';

export class RecipeTypeResponseDto {
  id: number;
  name: string;

  constructor(recipeType: RecipeType) {
    this.id = recipeType.id;
    this.name = recipeType.name;
  }
}

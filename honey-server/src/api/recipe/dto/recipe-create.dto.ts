import { IsString } from 'class-validator';

export class RecipeCreateDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  recipeTypeId: string;
}

import { IsNumber, IsString } from 'class-validator';

export class RecipeCreateDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  recipeTypeId: number;
}

import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RecipeUpdateDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  recipeTypeId: number;
}

import { IsNumber, IsOptional } from 'class-validator';

export class RecipeConditionRequestDto {
  @IsOptional()
  @IsNumber()
  userId: number;
}

import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RecipeCommentCreateRequestDto {
  @IsOptional()
  @IsNumber()
  targetCommentId: number;

  @IsString()
  content: string;
}

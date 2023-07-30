import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RecipeCommentCreateRequestDto {
  @IsOptional()
  @IsNumber()
  parentCommentId: number;

  @IsString()
  content: string;
}

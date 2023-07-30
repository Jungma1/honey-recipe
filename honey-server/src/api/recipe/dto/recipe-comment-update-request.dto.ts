import { IsString } from 'class-validator';

export class RecipeCommentUpdateRequestDto {
  @IsString()
  content: string;
}

import { IsString } from 'class-validator';

export class RecipeCreateRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

import { IsOptional, IsString } from 'class-validator';

export class RecipeUpdateRequestDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}

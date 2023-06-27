import { IsOptional, IsString } from 'class-validator';

export class RecipeCourseUpdateDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;
}

import { IsOptional, IsString } from 'class-validator';

export class RecipeCourseUpdateRequestDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content: string;
}

import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { RecipeCourseCreateRequestDto } from './recipe-course-create-request.dto';
import { RecipeCourseUpdateRequestDto } from './recipe-course-update-request.dto';

export class RecipeCreateRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @ValidateNested({ each: true })
  @Type(() => RecipeCourseUpdateRequestDto)
  @IsArray()
  course: RecipeCourseCreateRequestDto[];
}

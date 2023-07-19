import { Type } from 'class-transformer';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { RecipeCourseUpdateRequestDto } from './recipe-course-update-request.dto';

export class RecipeUpdateRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @ValidateNested({ each: true })
  @Type(() => RecipeCourseUpdateRequestDto)
  @IsArray()
  course: RecipeCourseUpdateRequestDto[];
}

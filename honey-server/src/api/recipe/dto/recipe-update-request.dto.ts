import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RecipeCourseUpdateRequestDto } from './recipe-course-update-request.dto';

export class RecipeUpdateRequestDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsBoolean()
  isPrivate: boolean;

  @ValidateNested({ each: true })
  @Type(() => RecipeCourseUpdateRequestDto)
  @IsArray()
  courses: RecipeCourseUpdateRequestDto[];
}

import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RecipeCourseUpdateRequestDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;
}

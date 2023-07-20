import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class RecipeCourseUpdateRequestDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  picture: string | null;

  @IsBoolean()
  created: boolean;
}

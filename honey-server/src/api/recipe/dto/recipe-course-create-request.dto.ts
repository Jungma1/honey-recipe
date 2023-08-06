import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RecipeCourseCreateRequestDto {
  @IsNumber()
  id: number;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  picture: string;
}

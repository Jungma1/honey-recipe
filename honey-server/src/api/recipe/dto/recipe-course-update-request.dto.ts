import { IsNumber, IsString } from 'class-validator';

export class RecipeCourseUpdateRequestDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  picture: string | null;
}

import { IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  handle: string;
}

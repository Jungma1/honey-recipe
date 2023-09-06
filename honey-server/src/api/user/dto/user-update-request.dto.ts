import { IsOptional, IsString } from 'class-validator';

export class UserUpdateRequestDto {
  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  handle: string;
}

import { User } from '@prisma/client';

export class AuthUserDto {
  id: number;
  username: string;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
  }
}

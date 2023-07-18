import { User } from '@prisma/client';

export class AuthUserDto {
  id: number;
  handle: string;
  username: string;
  picture: string;

  constructor(user: User) {
    this.id = user.id;
    this.handle = user.handle;
    this.username = user.username;
    this.picture = user.picture;
  }
}

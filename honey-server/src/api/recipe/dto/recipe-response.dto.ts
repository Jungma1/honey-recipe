import { Recipe, RecipeStat, User } from '@prisma/client';
import { AuthUserDto } from '~/api/auth/dto/auth-user.dto';

type RecipeRelation = Recipe & {
  user: User;
  recipeStat: RecipeStat;
};

export class RecipeResponseDto {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  likeCount: number;
  commentCount: number;
  user: AuthUserDto;
  createdAt: Date;
  updatedAt: Date;

  constructor(recipe: RecipeRelation) {
    this.id = recipe.id;
    this.title = recipe.title;
    this.description = recipe.description;
    this.thumbnail = recipe.thumbnail || null;
    this.likeCount = recipe.recipeStat.likeCount;
    this.commentCount = recipe.recipeStat.commentCount;
    this.user = new AuthUserDto(recipe.user);
    this.createdAt = recipe.createdAt;
    this.updatedAt = recipe.updatedAt;
  }
}

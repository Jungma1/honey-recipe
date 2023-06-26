import { Recipe, RecipeStat, RecipeType, User } from '@prisma/client';

type RecipeRelation = Recipe & {
  user: User;
  recipeType: RecipeType;
  recipeStat: RecipeStat;
};

export class RecipeResponseDto {
  id: number;
  title: string;
  description: string;
  recipeType: string;
  likeCount: number;
  commentCount: number;
  user: {
    id: number;
    handle: string;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;

  constructor(recipe: RecipeRelation) {
    this.id = recipe.id;
    this.title = recipe.title;
    this.description = recipe.description;
    this.recipeType = recipe.recipeType.name;
    this.likeCount = recipe.recipeStat.likeCount;
    this.commentCount = recipe.recipeStat.commentCount;
    this.user = {
      id: recipe.user.id,
      handle: '@handle',
      username: recipe.user.username,
    };
    this.createdAt = recipe.createdAt;
    this.updatedAt = recipe.updatedAt;
  }
}

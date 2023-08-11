import {
  Recipe,
  RecipeBookmark,
  RecipeCourse,
  RecipeLike,
  RecipeStat,
  User,
} from '@prisma/client';
import { AuthUserDto } from '~/api/auth/dto/auth-user.dto';
import { RecipeCourseResponseDto } from './recipe-course-response.dto';

type RecipeRelation = Recipe & {
  user: User;
  recipeStat: RecipeStat;
  recipeCourse: RecipeCourse[];
  recipeLike: RecipeLike[];
  recipeBookmark: RecipeBookmark[];
};

export class RecipeReadResponseDto {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  isPrivate: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
  likeCount: number;
  commentCount: number;
  user: AuthUserDto;
  createdAt: string;
  updatedAt: string;
  course: RecipeCourseResponseDto[];

  constructor(recipe: RecipeRelation) {
    this.id = recipe.id;
    this.title = recipe.title;
    this.description = recipe.description;
    this.thumbnail = recipe.thumbnail || null;
    this.isPrivate = recipe.isPrivate;
    this.isLiked = recipe.recipeLike?.length > 0;
    this.isBookmarked = recipe.recipeBookmark?.length > 0;
    this.likeCount = recipe.recipeStat.likeCount;
    this.commentCount = recipe.recipeStat.commentCount;
    this.user = new AuthUserDto(recipe.user);
    this.createdAt = recipe.createdAt.toString();
    this.updatedAt = recipe.updatedAt.toString();
    this.course = recipe.recipeCourse.map(
      (course) => new RecipeCourseResponseDto(course),
    );
  }
}

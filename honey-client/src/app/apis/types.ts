export interface Page<T> {
  page: number;
  size: number;
  totalCount: number;
  totalPage: number;
  isLast: boolean;
  items: T[];
}

export interface User {
  id: number;
  handle: string;
  picture: string;
  username: string;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  isPrivate: boolean;
  isLiked: boolean;
  isBookmarked: boolean;
  likeCount: number;
  commentCount: number;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeCourse {
  id: number;
  content: string;
  picture: string | null;
  created: boolean;
}

export interface RecipeComment {
  id: number;
  parentCommentId: number | null;
  content: string;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  mentionUser: User | null;
}

export interface RecipeRead extends Recipe {
  course: RecipeCourse[];
}

export interface RecipeRequest {
  title: string;
  description: string;
  thumbnail: string | null;
  isPrivate: boolean;
  course: RecipeCourse[];
}

export interface RecipeCreateResponse {
  id: number;
}

export interface RecipeCommentCreateRequest {
  content: string;
  targetCommentId: number | null;
}

export interface ImageUploadResponse {
  imagePath: string;
}

export interface PaginationRecipe extends Page<Recipe> {}

export interface UserUpdateRequest {
  handle: string;
  username: string;
}

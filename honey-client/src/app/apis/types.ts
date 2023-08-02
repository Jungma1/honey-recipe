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

export interface RecipeCreateRequest {
  title: string;
  description: string;
  thumbnail: File | null;
}

export interface RecipeCreateResponse {
  id: number;
}

export interface RecipeUpdateRequest {
  title: string;
  description: string;
  thumbnail: string | null;
  course: {
    id: number;
    content: string;
    picture: string | null;
    created: boolean;
  }[];
}

export interface RecipeCommentCreateRequest {
  content: string;
  parentCommentId: number | null;
}

export interface ImageUploadResponse {
  imagePath: string;
}

export interface PaginationRecipe extends Page<Recipe> {}

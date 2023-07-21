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
  createdAt: Date;
  updatedAt: Date;
  course: RecipeCourse[];
}

export interface RecipeCourse {
  id: number;
  content: string;
  picture: string | null;
  created: boolean;
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
  course: RecipeCourse[];
}

export interface ImageUploadResponse {
  imagePath: string;
}

export interface User {
  id: number;
  handle: string;
  picture: string;
  username: string;
}

export interface RecipeResponse {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  likeCount: number;
  commentCount: number;
  user: User;
  createdAt: Date;
  updatedAt: Date;
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
}

export interface RecipeUpdateResponse {
  title: string;
  description: string;
}

export interface RecipeThumbnailUpdateResponse {
  thumbnail: string;
}

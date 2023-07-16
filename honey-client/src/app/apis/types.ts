export interface User {
  id: number;
  username: string;
  picture: string;
}

export interface RecipeCreateRequest {
  title: string;
  description: string;
  thumbnail: File | null;
}
export interface RecipeCreateResponse {
  id: number;
}

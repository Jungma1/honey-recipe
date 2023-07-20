import { client } from '.';
import {
  ImageUploadResponse,
  Recipe,
  RecipeCreateRequest,
  RecipeCreateResponse,
  RecipeUpdateRequest,
} from './types';

export const getRecipe = async (id: number) => {
  const response = await client.get<Recipe>(`/api/v1/recipe/${id}`);
  return response.data;
};

export const postRecipe = async (request: RecipeCreateRequest) => {
  const formData = new FormData();
  formData.append('title', request.title);
  formData.append('description', request.description);
  if (request.thumbnail) formData.append('thumbnail', request.thumbnail);

  const response = await client.post<RecipeCreateResponse>('/api/v1/recipe', formData);
  return response.data;
};

export const patchRecipe = async (id: number, request: RecipeUpdateRequest) => {
  const response = await client.patch(`/api/v1/recipe/${id}`, request);
  return response.data;
};

export const postRecipeImage = async (id: number, image: File) => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await client.post<ImageUploadResponse>(`/api/v1/recipe/${id}/image`, formData);
  return response.data;
};

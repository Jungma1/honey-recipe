import { client } from '.';
import {
  RecipeCreateRequest,
  RecipeCreateResponse,
  RecipeResponse,
  RecipeThumbnailUpdateResponse,
  RecipeUpdateRequest,
} from './types';

export const getRecipe = async (id: number) => {
  const response = await client.get<RecipeResponse>(`/api/v1/recipe/${id}`);
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

export const patchRecipeThumbnail = async (id: number, thumbnail: File) => {
  const formData = new FormData();
  formData.append('thumbnail', thumbnail);

  const response = await client.patch<RecipeThumbnailUpdateResponse>(
    `/api/v1/recipe/${id}/thumbnail`,
    formData
  );
  return response.data;
};

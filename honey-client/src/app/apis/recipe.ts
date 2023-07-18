import { client } from '.';
import {
  RecipeCreateRequest,
  RecipeCreateResponse,
  RecipeResponse,
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
  const formData = new FormData();
  formData.append('title', request.title);
  formData.append('description', request.description);
  if (request.thumbnail) formData.append('thumbnail', request.thumbnail);

  const response = await client.patch(`/api/v1/recipe/${id}`, formData);
  return response.data;
};

import { client } from '.';
import {
  ImageUploadResponse,
  PaginationRecipe,
  RecipeComment,
  RecipeCommentCreateRequest,
  RecipeCreateRequest,
  RecipeCreateResponse,
  RecipeRead,
  RecipeUpdateRequest,
} from './types';

export const getRecipes = async (page: number, size: number, mode: string) => {
  const response = await client.get<PaginationRecipe>('/api/v1/recipe', {
    params: {
      page,
      size,
      mode,
    },
  });
  return { ...response.data, nextPage: page + 1 };
};

export const getRecipe = async (id: number) => {
  const response = await client.get<RecipeRead>(`/api/v1/recipe/${id}`);
  return response.data;
};

export const getRecipeComments = async (id: number) => {
  const response = await client.get<RecipeComment[]>(`/api/v1/recipe/${id}/comments`);
  return response.data;
};

export const postRecipe = async ({ title, description, thumbnail }: RecipeCreateRequest) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  if (thumbnail) formData.append('thumbnail', thumbnail);

  const response = await client.post<RecipeCreateResponse>('/api/v1/recipe', formData);
  return response.data;
};

export const patchRecipe = async ({
  id,
  request,
}: {
  id: number;
  request: RecipeUpdateRequest;
}) => {
  const response = await client.patch(`/api/v1/recipe/${id}`, request);
  return response.data;
};

export const postRecipeImage = async ({ id, image }: { id: number; image: File }) => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await client.post<ImageUploadResponse>(`/api/v1/recipe/${id}/image`, formData);
  return response.data;
};

export const deleteRecipe = async (id: number) => {
  await client.delete(`/api/v1/recipe/${id}`);
};

export const postRecipeComment = async ({
  id,
  request,
}: {
  id: number;
  request: RecipeCommentCreateRequest;
}) => {
  const response = await client.post(`/api/v1/recipe/${id}/comments`, request);
  return response.data;
};

export const getRecipeSubComments = async (id: number, commentId: number) => {
  const response = await client.get<RecipeComment[]>(`/api/v1/recipe/${id}/comments/${commentId}`);
  return response.data;
};

export const patchRecipeComment = async ({
  id,
  commentId,
  content,
}: {
  id: number;
  commentId: number;
  content: string;
}) => {
  const response = await client.patch(`/api/v1/recipe/${id}/comments/${commentId}`, { content });
  return response.data;
};

export const deleteRecipeComment = async ({ id, commentId }: { id: number; commentId: number }) => {
  await client.delete(`/api/v1/recipe/${id}/comments/${commentId}`);
};

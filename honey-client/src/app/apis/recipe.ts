import { client } from '.';
import {
  ImageUploadResponse,
  PaginationRecipe,
  RecipeComment,
  RecipeCommentCreateRequest,
  RecipeCreateResponse,
  RecipeRead,
  RecipeRequest,
} from './types';

export const getRecipes = async (page: number, size: number, mode: string, userId?: number) => {
  const response = await client.get<PaginationRecipe>('/api/v1/recipes', {
    data: {
      userId,
    },
    params: {
      page,
      size,
      mode,
    },
  });
  return { ...response.data, nextPage: page + 1 };
};

export const getRecipe = async (id: number) => {
  const response = await client.get<RecipeRead>(`/api/v1/recipes/${id}`);
  return response.data;
};

export const getRecipeComments = async (id: number) => {
  const response = await client.get<RecipeComment[]>(`/api/v1/recipes/${id}/comments`);
  return response.data;
};

export const postRecipe = async ({ request }: { request: RecipeRequest }) => {
  const response = await client.post<RecipeCreateResponse>('/api/v1/recipes', request);
  return response.data;
};

export const patchRecipe = async ({ id, request }: { id: number; request: RecipeRequest }) => {
  const response = await client.patch(`/api/v1/recipes/${id}`, request);
  return response.data;
};

export const postRecipeImage = async (image: File) => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await client.post<ImageUploadResponse>(`/api/v1/recipes/image`, formData);
  return response.data;
};

export const deleteRecipe = async (id: number) => {
  await client.delete(`/api/v1/recipes/${id}`);
};

export const postRecipeComment = async ({
  id,
  request,
}: {
  id: number;
  request: RecipeCommentCreateRequest;
}) => {
  const response = await client.post(`/api/v1/recipes/${id}/comments`, request);
  return response.data;
};

export const getRecipeSubComments = async (id: number, commentId: number) => {
  const response = await client.get<RecipeComment[]>(`/api/v1/recipes/${id}/comments/${commentId}`);
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
  const response = await client.patch(`/api/v1/recipes/${id}/comments/${commentId}`, { content });
  return response.data;
};

export const deleteRecipeComment = async ({ id, commentId }: { id: number; commentId: number }) => {
  await client.delete(`/api/v1/recipes/${id}/comments/${commentId}`);
};

export const postRecipeLike = async ({ id }: { id: number }) => {
  await client.post(`/api/v1/recipes/${id}/likes`);
};

export const deleteRecipeLike = async ({ id }: { id: number }) => {
  await client.delete(`/api/v1/recipes/${id}/likes`);
};

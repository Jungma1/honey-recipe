import { client } from '.';
import { RecipeCreateRequest, RecipeCreateResponse } from './types';

export const postRecipe = async (request: RecipeCreateRequest) => {
  const formData = new FormData();
  formData.append('title', request.title);
  formData.append('description', request.description);
  if (request.thumbnail) formData.append('thumbnail', request.thumbnail);

  const response = await client.post<RecipeCreateResponse>('/api/v1/recipe', formData);
  return response.data;
};

import { client } from '.';
import { RecipeCreateResponse } from './types';

export const postRecipe = async (request: FormData) => {
  const response = await client.post<RecipeCreateResponse>('/api/v1/recipe', request);
  return response.data;
};

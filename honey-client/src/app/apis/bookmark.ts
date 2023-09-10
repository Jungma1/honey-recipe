import { client } from '.';
import { PaginationRecipe } from './types';

export const getBookmarks = async (page: number, size: number) => {
  const response = await client.get<PaginationRecipe>('/api/v1/bookmarks', {
    params: {
      page,
      size,
    },
  });
  return response.data;
};

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { postRecipe } from '~/apis/recipe';
import { RecipeCreateRequest } from '~/apis/types';
import { UseMutationOptionsType } from '~/utils/types';

export function useRecipeCreateMutation(options?: UseMutationOptionsType<typeof postRecipe>) {
  const router = useRouter();

  return useMutation((request: RecipeCreateRequest) => postRecipe(request), {
    ...options,
    onSuccess: ({ id }) => {
      router.push(`/recipe/edit?id=${id}`);
    },
  });
}

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { postRecipe } from '~/apis/recipe';
import { RecipeCreateRequest } from '~/apis/types';
import { useRecipeStore } from '~/stores/recipe';
import { UseMutationOptionsType } from '~/utils/types';

export function useRecipeCreateMutation(options?: UseMutationOptionsType<typeof postRecipe>) {
  const router = useRouter();
  const { changeErrorMessage } = useRecipeStore();

  return useMutation((request: RecipeCreateRequest) => postRecipe(request), {
    ...options,
    onSuccess: ({ id }) => {
      router.push(`/recipe/edit?id=${id}`);
    },
    onError: () => {
      changeErrorMessage('레시피 작성에 실패했습니다.');
    },
  });
}

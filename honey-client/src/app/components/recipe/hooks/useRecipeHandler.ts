import { useRecipeStore } from '~/stores/recipe';

export function useRecipeHandler() {
  const { changeForm } = useRecipeStore();

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeForm('title', e.target.value);
  };

  const handleChangeDescription = (value: string) => {
    changeForm('description', value);
  };

  return { handleChangeTitle, handleChangeDescription };
}

import { useState } from 'react';

export function useRecipeForm() {
  const [form, setFrom] = useState({ title: '', description: '' });

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrom((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleChangeDescription = (value: string) => {
    setFrom((prev) => ({ ...prev, description: value }));
  };

  return { form, handleChangeTitle, handleChangeDescription };
}

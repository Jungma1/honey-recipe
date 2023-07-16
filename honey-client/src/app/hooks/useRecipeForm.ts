import { useState } from 'react';

interface InitialForm {
  title: string;
  description: string;
}

export function useRecipeForm(initialForm?: InitialForm) {
  const [form, setFrom] = useState(initialForm ?? { title: '', description: '' });

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrom((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleChangeDescription = (value: string) => {
    setFrom((prev) => ({ ...prev, description: value }));
  };

  return { form, handleChangeTitle, handleChangeDescription };
}

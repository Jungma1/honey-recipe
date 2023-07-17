import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface RecipeState {
  form: {
    title: string;
    description: string;
    thumbnail: File | null;
  };
  errorMessage: string;
}

interface RecipeAction {
  changeForm: (key: keyof RecipeState['form'], value: string) => void;
  changeThumbnail: (thumbnail: File | null) => void;
  changeErrorMessage: (errorMessage: string) => void;
}

interface RecipeStore extends RecipeState, RecipeAction {}

const initialState: RecipeState = {
  form: {
    title: '',
    description: '',
    thumbnail: null,
  },
  errorMessage: '',
};

export const useRecipeStore = create<RecipeStore>()(
  devtools((set) => ({
    ...initialState,
    changeForm: (key, value) => set(({ form }) => ({ form: { ...form, [key]: value } })),
    changeThumbnail: (thumbnail) => set(({ form }) => ({ form: { ...form, thumbnail } })),
    changeErrorMessage: (errorMessage) => set({ errorMessage }),
  }))
);

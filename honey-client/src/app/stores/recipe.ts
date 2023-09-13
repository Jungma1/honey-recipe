import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { RecipeCourse } from '~/apis/types';

interface RecipeState {
  title: string;
  description: string;
  thumbnail: string | null;
  isPrivate: boolean;
  course: RecipeCourse | [];
}

interface RecipeAction {}

interface RecipeStore extends RecipeState, RecipeAction {}

const initialState: RecipeStore = {
  title: '',
  description: '',
  thumbnail: null,
  isPrivate: false,
  course: [],
};

export const useRecipeStore = create<RecipeStore>()(
  devtools((set) => ({
    ...initialState,
  }))
);

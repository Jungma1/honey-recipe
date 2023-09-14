import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { RecipeCourse, RecipeRead } from '~/apis/types';

interface Form {
  title: string;
  description: string;
  thumbnail: string | null;
  isPrivate: boolean;
  courses: RecipeCourse[] | [];
}

interface EditorState {
  title: string;
  description: string;
  thumbnail: string | null;
  isPrivate: boolean;
  courses: RecipeCourse[] | [];
  isPublish: boolean;
}

interface EditorAction {
  resetForm(): void;
  getForm(): Form;
  setForm(recipe: RecipeRead): void;
  setTitle(title: string): void;
  setDescription(description: string): void;
  setThumbnail(thumbnail: string | null): void;
  setIsPrivate(isPrivate: boolean): void;
  setCourses(courses: RecipeCourse[]): void;
  setContent(courseId: number, content: string): void;
  setPicture(courseId: number, picture: string | null): void;
  createCourse(): void;
  removeCourse(courseId: number): void;
  openPublish(): void;
  closePublish(): void;
}

interface EditorStore extends EditorState, EditorAction {}

const initialState: EditorState = {
  title: '',
  description: '',
  thumbnail: null,
  isPrivate: false,
  courses: [],
  isPublish: false,
};

export const useEditorStore = create<EditorStore>()(
  devtools((set, get) => ({
    ...initialState,
    resetForm: () => set(initialState),
    getForm: () => ({
      title: get().title,
      description: get().description,
      thumbnail: get().thumbnail,
      isPrivate: get().isPrivate,
      courses: get().courses,
    }),
    setForm: (recipe) =>
      set({
        title: recipe.title,
        description: recipe.description,
        thumbnail: recipe.thumbnail,
        isPrivate: recipe.isPrivate,
        courses: recipe.course,
      }),
    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setThumbnail: (thumbnail) => set({ thumbnail }),
    setIsPrivate: (isPrivate) => set({ isPrivate }),
    setCourses: (courses) => set({ courses }),
    setContent: (courseId, content) => {
      set((state) => ({
        courses: state.courses.map((course) =>
          course.id === courseId ? { ...course, content } : course
        ),
      }));
    },
    setPicture: (courseId, picture) => {
      set((state) => ({
        courses: state.courses.map((course) =>
          course.id === courseId ? { ...course, picture } : course
        ),
      }));
    },
    createCourse: () => {
      set((state) => ({
        courses: [
          ...state.courses,
          { id: Math.random(), content: '', picture: null, created: false },
        ],
      }));
    },
    removeCourse: (courseId) => {
      set((state) => ({
        courses: state.courses.filter((course) => course.id !== courseId),
      }));
    },
    openPublish() {
      set({ isPublish: true });
    },
    closePublish() {
      set({ isPublish: false });
    },
  }))
);

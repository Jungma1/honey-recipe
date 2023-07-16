import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User } from '~/apis/types';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserState = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
      }),
      { name: 'user' }
    )
  )
);

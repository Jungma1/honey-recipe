import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { User } from '~/apis/types';

interface UserState {
  user: User | null;
}

interface UserAction {
  setUser: (user: User | null) => void;
}

interface UserStore extends UserState, UserAction {}

const initialState: UserState = {
  user: null,
};

export const useUserStore = create<UserStore>()(
  devtools((set) => ({
    ...initialState,
    setUser: (user) => set({ user }),
  }))
);

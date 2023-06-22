import { useEffect } from 'react';
import { User } from '~/apis/types';
import { useRootStore } from '~/stores';

export const useAuthEffect = (user: User | null) => {
  const { setUser } = useRootStore();

  useEffect(() => {
    setUser(user);
  }, [setUser, user]);
};

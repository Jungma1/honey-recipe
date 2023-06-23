import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getProfile } from '~/apis/user';
import { useRootStore } from '~/stores';

function Core() {
  const { setUser } = useRootStore();
  const { data, isLoading } = useQuery(['user', 'profile'], () => getProfile());

  useEffect(() => {
    if (isLoading) return;
    setUser(data || null);
  }, [setUser, data, isLoading]);

  return null;
}

export default Core;

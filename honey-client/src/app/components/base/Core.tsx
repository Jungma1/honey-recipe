import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getProfile } from '~/apis/user';
import { useRootStore } from '~/stores';

interface Props {
  isAuth: boolean;
}

function Core({ isAuth }: Props) {
  const { setUser } = useRootStore();
  const { data, isLoading } = useQuery(['user', 'profile'], () => getProfile(), {
    enabled: isAuth,
  });

  useEffect(() => {
    if (isLoading) return;
    setUser(data || null);
  }, [setUser, data, isLoading]);

  return <></>;
}

export default Core;

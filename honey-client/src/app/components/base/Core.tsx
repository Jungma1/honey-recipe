import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getProfile } from '~/apis/user';
import { useUserStore } from '~/stores/user';

interface Props {
  isAuth: boolean;
}

function Core({ isAuth }: Props) {
  const { setUser } = useUserStore();
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

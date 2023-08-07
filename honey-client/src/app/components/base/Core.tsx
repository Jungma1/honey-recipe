import { useEffect } from 'react';
import { User } from '~/apis/types';
import { useUserStore } from '~/stores/user';

interface Props {
  user: User | null;
}

function Core({ user }: Props) {
  const { setUser } = useUserStore();

  useEffect(() => {
    setUser(user || null);
  }, [setUser, user]);

  return <></>;
}

export default Core;

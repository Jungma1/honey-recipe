import { useRouter } from 'next/router';
import { useEffect } from 'react';

const requiredLoginPaths = [''];

export function useRequiredLoginPageEffect() {
  const router = useRouter();

  useEffect(() => {
    if (requiredLoginPaths.includes(router.pathname)) {
      router.push('/login');
    }
  }, [router]);
}

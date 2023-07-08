import { GetServerSidePropsContext } from 'next';

export const validateTokenCookie = (context: GetServerSidePropsContext) => {
  const cookies = context.req.headers.cookie;
  if (cookies && cookies.includes('token')) {
    return { isAuth: true };
  }
  return { isAuth: false };
};

import { GetServerSideProps } from 'next';
import AuthContainer from '~/components/auth/AuthContainer';
import MainLayout from '~/components/layout/MainLayout';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';

export default function LoginPage() {
  return (
    <MainLayout>
      <AuthContainer />
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isAuth } = validateTokenCookie(context);
  return json({ isAuth });
};

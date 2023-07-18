import { GetServerSidePropsContext } from 'next';
import AuthContainer from '~/components/auth/AuthContainer';
import MainLayout from '~/components/layout/MainLayout';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { isAuth } = validateTokenCookie(context);
  return json({ isAuth });
};

export default function LoginPage() {
  return (
    <MainLayout>
      <AuthContainer />
    </MainLayout>
  );
}

import { GetServerSidePropsContext } from 'next';
import { withCookie } from '~/apis';
import { getProfile } from '~/apis/user';
import AuthContainer from '~/components/auth/AuthContainer';
import MainLayout from '~/components/layout/MainLayout';
import { json } from '~/utils/json';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withCookie(() => getProfile(), context);
  return json({ user });
};

export default function LoginPage() {
  return (
    <MainLayout>
      <AuthContainer />
    </MainLayout>
  );
}

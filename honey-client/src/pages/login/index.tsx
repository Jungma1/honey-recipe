import { GetServerSidePropsContext } from 'next';
import { withSSR } from '~/apis';
import { getProfile } from '~/apis/user';
import AuthContainer from '~/components/auth/AuthContainer';
import MainLayout from '~/components/layout/MainLayout';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withSSR(() => getProfile(), context);
  if (user) return redirect('/');
  return json({ user });
};

export default function LoginPage() {
  return (
    <MainLayout>
      <AuthContainer />
    </MainLayout>
  );
}

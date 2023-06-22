import { GetServerSideProps } from 'next';
import { withClientCookie } from '~/apis';
import { getProfile } from '~/apis/user';
import Header from '~/components/common/Header';
import MainLayout from '~/components/layout/MainLayout';
import { json } from '~/utils/json';

export default function Home() {
  return (
    <MainLayout>
      <Header />
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await withClientCookie(() => getProfile(), context);
  return json({ user });
};

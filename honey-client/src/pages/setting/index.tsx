import { GetServerSidePropsContext } from 'next';
import { withSSR } from '~/apis';
import { getProfile } from '~/apis/user';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import SettingProfile from '~/components/setting/SettingProfile';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withSSR(() => getProfile(), context);
  if (!user) return redirect('/login');
  return json({ user });
};

export default function SettingPage() {
  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <SettingProfile />
      </ContentLayout>
    </MainLayout>
  );
}

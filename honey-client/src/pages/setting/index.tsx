import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { withSSR } from '~/apis';
import { getProfile } from '~/apis/user';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import Setting from '~/components/setting/Setting';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

interface Props extends InferGetServerSidePropsType<typeof getServerSideProps> {}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withSSR(() => getProfile(), context);
  if (!user) return redirect('/login');
  return json({ user });
};

export default function SettingPage({ user }: Props) {
  return (
    <MainLayout>
      <Header user={user} />
      <ContentLayout>
        <Setting profile={user} />
      </ContentLayout>
    </MainLayout>
  );
}

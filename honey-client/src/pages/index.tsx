import { GetServerSideProps } from 'next';
import { withClientCookie } from '~/apis';
import { getProfile } from '~/apis/user';
import { useRootStore } from '~/stores';
import { json } from '~/utils/json';

export default function Home() {
  const { user } = useRootStore();

  return (
    <div>
      <h1>{user?.username}</h1>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await withClientCookie(() => getProfile(), context);
  return json({ user });
};

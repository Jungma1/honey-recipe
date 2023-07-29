import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { getRecipe } from '~/apis/recipe';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeViewer from '~/components/recipe/RecipeViewer';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';

interface Props extends InferGetServerSidePropsType<typeof getServerSideProps> {}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { isAuth } = validateTokenCookie(context);
  const queryClient = new QueryClient();
  const id = parseInt(context.params?.id as string);

  await queryClient.prefetchQuery(['recipe', id], () => getRecipe(id));

  return json({ isAuth, id, dehydratedState: dehydrate(queryClient) });
};

export default function RecipeDetailPage({ id }: Props) {
  const router = useRouter();
  const { data: recipe, isError } = useQuery(['recipe', id], () => getRecipe(id));

  if (!recipe || isError) {
    return router.push('/404');
  }

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeViewer recipe={recipe} />
      </ContentLayout>
    </MainLayout>
  );
}

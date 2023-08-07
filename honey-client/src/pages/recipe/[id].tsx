import styled from '@emotion/styled';
import { QueryClient, dehydrate, useQueries } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { withSSR } from '~/apis';
import { getRecipe, getRecipeComments } from '~/apis/recipe';
import { getProfile } from '~/apis/user';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeCourseList from '~/components/recipe/RecipeCourseList';
import RecipeViewerHeader from '~/components/recipe/RecipeViewerHeader';
import RecipeViewerInteraction from '~/components/recipe/RecipeViewerInteraction';
import RecipeCommentList from '~/components/recipe/comment/RecipeCommentList';
import { json } from '~/utils/json';

interface Props extends InferGetServerSidePropsType<typeof getServerSideProps> {}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withSSR(() => getProfile(), context);
  const queryClient = new QueryClient();
  const id = parseInt(context.params?.id as string);

  await queryClient.prefetchQuery(['recipe', id], () => getRecipe(id));
  await queryClient.prefetchQuery(['comments', id], () => getRecipeComments(id));

  return json({ user, id, dehydratedState: dehydrate(queryClient) });
};

export default function RecipeDetailPage({ user, id }: Props) {
  const router = useRouter();

  const [{ data: recipe, isError }, { data: comments }] = useQueries({
    queries: [
      { queryKey: ['recipe', id], queryFn: () => getRecipe(id) },
      { queryKey: ['comments', id], queryFn: () => getRecipeComments(id) },
    ],
  });

  if (!recipe || isError) {
    return router.push('/404');
  }

  const isOwner = recipe.user.id === user?.id;

  return (
    <MainLayout>
      <Header user={user} />
      <ContentLayout>
        <Block>
          <RecipeViewerHeader recipe={recipe} />
          <RecipeViewerInteraction isOwner={isOwner} recipeId={recipe.id} />
          <RecipeCourseList course={recipe.course} />
          <RecipeCommentList comments={comments!} />
        </Block>
      </ContentLayout>
    </MainLayout>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

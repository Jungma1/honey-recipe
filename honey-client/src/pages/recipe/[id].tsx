import styled from '@emotion/styled';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { withSSR } from '~/apis';
import { getRecipe, getRecipeComments } from '~/apis/recipe';
import { getProfile } from '~/apis/user';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeCommentList from '~/components/recipe/comment/RecipeCommentList';
import RecipeCourseList from '~/components/recipe/course/RecipeCourseList';
import RecipeViewerHeader from '~/components/recipe/viewer/RecipeViewerHeader';
import RecipeViewerReaction from '~/components/recipe/viewer/RecipeViewerReaction';
import { queryKeys } from '~/constants/queryKeys';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

interface Props extends InferGetServerSidePropsType<typeof getServerSideProps> {}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withSSR(() => getProfile(), context);
  const id = parseInt(context.params?.id as string);
  const recipe = await getRecipe(id);
  const isOwner = recipe.user.id === user?.id;

  if (recipe.isPrivate && !isOwner) return redirect('/404');

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([queryKeys.comments], () => getRecipeComments(id));

  return json({ user, recipe, id, dehydratedState: dehydrate(queryClient) });
};

export default function RecipeDetailPage({ recipe, id }: Props) {
  const { data: comments } = useQuery([queryKeys.comments], () => getRecipeComments(id));

  if (!comments) return null;

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <Block>
          <RecipeViewerHeader recipe={recipe} />
          <RecipeCourseList course={recipe.course} />
          <RecipeViewerReaction recipe={recipe} />
          <RecipeCommentList comments={comments} commentCount={recipe.commentCount} />
        </Block>
      </ContentLayout>
    </MainLayout>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

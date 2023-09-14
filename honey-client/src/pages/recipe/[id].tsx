import styled from '@emotion/styled';
import { QueryClient, dehydrate, useQueries } from '@tanstack/react-query';
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
import RecipeViewerInteraction from '~/components/recipe/viewer/RecipeViewerInteraction';
import RecipeViewerReaction from '~/components/recipe/viewer/RecipeViewerReaction';
import { queryKeys } from '~/constants/queryKeys';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

interface Props extends InferGetServerSidePropsType<typeof getServerSideProps> {}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withSSR(() => getProfile(), context);
  const queryClient = new QueryClient();
  const id = parseInt(context.params?.id as string);

  const recipe = await getRecipe(id);
  if (recipe.isPrivate && recipe.user.id !== user?.id) return redirect('/404');

  const isOwner = recipe.user.id === user?.id;
  await queryClient.prefetchQuery([queryKeys.comments, id], () => getRecipeComments(id));

  return json({ user, id, recipe, isOwner, dehydratedState: dehydrate(queryClient) });
};

export default function RecipeDetailPage({ id, recipe, isOwner }: Props) {
  const [{ data }, { data: comments }] = useQueries({
    queries: [
      { queryKey: [queryKeys.recipe, id], queryFn: () => getRecipe(id), initialData: recipe },
      { queryKey: [queryKeys.comments, id], queryFn: () => getRecipeComments(id) },
    ],
  });

  if (!data || !comments) return null;

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <Block>
          <RecipeViewerHeader recipe={data} />
          <RecipeViewerInteraction isOwner={isOwner} recipeId={data.id} />
          <RecipeCourseList course={data.course} />
          <RecipeViewerReaction
            isLiked={recipe.isLiked}
            isBookmarked={recipe.isBookmarked}
            recipeId={data.id}
          />
          <RecipeCommentList comments={comments} commentCount={data.commentCount} />
        </Block>
      </ContentLayout>
    </MainLayout>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

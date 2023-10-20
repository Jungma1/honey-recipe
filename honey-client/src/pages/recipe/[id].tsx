import styled from '@emotion/styled';
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
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

interface Props extends InferGetServerSidePropsType<typeof getServerSideProps> {}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withSSR(() => getProfile(), context);
  const id = parseInt(context.params?.id as string);
  const recipe = await getRecipe(id);
  const comments = await getRecipeComments(id);
  const isOwner = recipe.user.id === user?.id;

  if (recipe.isPrivate && !isOwner) return redirect('/404');
  return json({ user, recipe, comments, isOwner });
};

export default function RecipeDetailPage({ recipe, comments, isOwner }: Props) {
  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <Block>
          <RecipeViewerHeader recipe={recipe} />
          <RecipeViewerInteraction
            isOwner={isOwner}
            isPrivate={recipe.isPrivate}
            recipeId={recipe.id}
          />
          <RecipeCourseList course={recipe.course} />
          <RecipeViewerReaction
            isLiked={recipe.isLiked}
            isBookmarked={recipe.isBookmarked}
            recipeId={recipe.id}
          />
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

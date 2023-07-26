import { useInfiniteQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useCallback, useMemo, useRef } from 'react';
import { getRecipes } from '~/apis/recipe';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeBanner from '~/components/recipe/RecipeBanner';
import RecipeList from '~/components/recipe/RecipeList';
import RecipeListTab from '~/components/recipe/RecipeListTab';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { isAuth } = validateTokenCookie(context);
  const mode = (context.query.mode as string) || 'recent';
  if (!['recent', 'daily', 'weekly', 'monthly'].includes(mode)) {
    return redirect('/');
  }

  const recipes = await getRecipes(1, 10, mode);
  return json({ isAuth, recipes, mode });
};

export default function HomePage({
  recipes,
  mode,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['recipes', mode],
    ({ pageParam = 1 }) => getRecipes(pageParam, 10, mode),
    {
      initialData: {
        pageParams: [undefined],
        pages: [recipes],
      },
      getNextPageParam: (lastPage) => (!lastPage.isLast ? lastPage.nextPage : undefined),
    }
  );

  const fetchNext = useCallback(async () => {
    if (hasNextPage && !isFetching) {
      await fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetching]);

  const items = useMemo(() => (data ? data.pages.flatMap(({ items }) => items) : []), [data]);

  useInfiniteScroll(ref, fetchNext);

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeBanner />
        <RecipeListTab mode={mode} />
        <RecipeList recipes={items} />
        <div ref={ref} />
      </ContentLayout>
    </MainLayout>
  );
}

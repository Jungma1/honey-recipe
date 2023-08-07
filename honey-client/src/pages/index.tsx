import { useInfiniteQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useCallback, useMemo, useRef } from 'react';
import { withSSR } from '~/apis';
import { getRecipes } from '~/apis/recipe';
import { getProfile } from '~/apis/user';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeBannerList from '~/components/recipe/RecipeBannerList';
import RecipeList from '~/components/recipe/RecipeList';
import RecipeListTab from '~/components/recipe/RecipeListTab';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

interface Props extends InferGetServerSidePropsType<typeof getServerSideProps> {}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withSSR(() => getProfile(), context);
  const mode = (context.query.mode as string) || 'recent';
  if (!['recent', 'daily', 'weekly', 'monthly'].includes(mode)) {
    return redirect('/');
  }

  const bestRecipes = await getRecipes(1, 10, 'yearly');
  const recipes = await getRecipes(1, 10, mode);
  return json({ user, bestRecipes, recipes, mode });
};

export default function HomePage({ user, bestRecipes, recipes, mode }: Props) {
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
      <Header user={user} />
      <ContentLayout>
        <RecipeBannerList recipes={bestRecipes.items} />
        <RecipeListTab mode={mode} />
        <RecipeList recipes={items} />
        <div ref={ref} />
      </ContentLayout>
    </MainLayout>
  );
}

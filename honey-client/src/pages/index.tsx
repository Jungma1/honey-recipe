import { useInfiniteQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useCallback, useMemo, useRef } from 'react';
import { getRecipes } from '~/apis/recipe';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeBanner from '~/components/recipe/RecipeBanner';
import RecipeList from '~/components/recipe/RecipeList';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { isAuth } = validateTokenCookie(context);
  const recipes = await getRecipes(1, 10);
  return json({ isAuth, recipes });
};

export default function HomePage({
  recipes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const ref = useRef<HTMLDivElement>(null);
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['recipes'],
    ({ pageParam = 1 }) => getRecipes(pageParam, 10),
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
        <RecipeList recipes={items} />
        <div ref={ref} />
      </ContentLayout>
    </MainLayout>
  );
}

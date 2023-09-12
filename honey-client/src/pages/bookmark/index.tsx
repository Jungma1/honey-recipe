import { useInfiniteQuery } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useCallback, useMemo, useRef } from 'react';
import { withSSR } from '~/apis';
import { getBookmarks } from '~/apis/bookmark';
import { getProfile } from '~/apis/user';
import Header from '~/components/common/Header';
import TitleGroup from '~/components/common/TitleGroup';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeList from '~/components/recipe/RecipeList';
import { queryKeys } from '~/constants/queryKeys';
import { useInfiniteScroll } from '~/hooks/useInfiniteScroll';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

interface Props extends InferGetServerSidePropsType<typeof getServerSideProps> {}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withSSR(() => getProfile(), context);
  if (!user) return redirect('/login');

  const bookmarks = await withSSR(() => getBookmarks(1, 10), context);
  return json({ user, bookmarks });
};

export default function BookmarkPage({ bookmarks }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { data, isFetched, hasNextPage, fetchNextPage } = useInfiniteQuery(
    [queryKeys.bookmarks],
    ({ pageParam }) => getBookmarks(pageParam, 10),
    {
      initialData: {
        pageParams: [undefined],
        pages: [bookmarks],
      },
      getNextPageParam: (lastPage) => (!lastPage.isLast ? lastPage.page + 1 : undefined),
    }
  );

  const fetchNext = useCallback(async () => {
    if (hasNextPage && isFetched) {
      await fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetched]);

  const recipes = useMemo(() => (data ? data.pages.flatMap(({ items }) => items) : []), [data]);

  useInfiniteScroll(ref, fetchNext);

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <TitleGroup title="북마크">
          <RecipeList recipes={recipes} />
        </TitleGroup>
        <div ref={ref} />
      </ContentLayout>
    </MainLayout>
  );
}

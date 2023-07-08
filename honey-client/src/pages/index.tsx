import { GetServerSideProps } from 'next';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeBanner from '~/components/recipe/RecipeBanner';
import RecipeList from '~/components/recipe/RecipeList';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';

export default function Home() {
  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeBanner />
        <RecipeList />
      </ContentLayout>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = (context) => {
  const { isAuth } = validateTokenCookie(context);
  return json({ isAuth });
};

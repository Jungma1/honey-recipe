import { GetServerSidePropsContext } from 'next';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeBanner from '~/components/recipe/RecipeBanner';
import RecipeList from '~/components/recipe/RecipeList';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { isAuth } = validateTokenCookie(context);
  return json({ isAuth });
};

export default function HomePage() {
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

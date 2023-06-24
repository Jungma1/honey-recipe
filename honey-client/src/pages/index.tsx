import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeBanner from '~/components/recipe/RecipeBanner';
import RecipeList from '~/components/recipe/RecipeList';

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

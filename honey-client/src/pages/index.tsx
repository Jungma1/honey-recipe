import Header from '~/components/common/Header';
import MainLayout from '~/components/layout/MainLayout';
import RecipeContainer from '~/components/recipe/RecipeContainer';

export default function Home() {
  return (
    <MainLayout>
      <Header />
      <RecipeContainer />
    </MainLayout>
  );
}

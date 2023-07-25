import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';

export default function RecipeDetailPage() {
  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <div>RecipeDetailPage</div>
      </ContentLayout>
    </MainLayout>
  );
}

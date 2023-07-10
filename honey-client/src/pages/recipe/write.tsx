import { GetServerSideProps } from 'next';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeWriteButton from '~/components/recipe/RecipeWriteButton';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';

export default function RecipeWritePage() {
  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeWriteButton />
        <section>List</section>
      </ContentLayout>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = (context) => {
  const { isAuth } = validateTokenCookie(context);
  return json({ isAuth });
};

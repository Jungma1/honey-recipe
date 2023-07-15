import { GetServerSideProps } from 'next';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeForm from '~/components/recipe/RecipeForm';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';
import { redirect } from '~/utils/route';

export default function RecipeWritePage() {
  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeForm />
      </ContentLayout>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isAuth } = validateTokenCookie(context);
  if (!isAuth) return redirect('/login');
  return json({ isAuth });
};

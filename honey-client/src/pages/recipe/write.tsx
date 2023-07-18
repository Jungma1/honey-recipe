import { useMutation } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { postRecipe } from '~/apis/recipe';
import { RecipeCreateRequest } from '~/apis/types';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeEditor from '~/components/recipe/RecipeEditor';
import RecipeForm from '~/components/recipe/RecipeForm';
import { useRecipeHandler } from '~/components/recipe/hooks/useRecipeHandler';
import { useRecipeStore } from '~/stores/recipe';
import { validateTokenCookie } from '~/utils/cookie';
import { upload } from '~/utils/file';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { isAuth } = validateTokenCookie(context);
  if (!isAuth) return redirect('/login');
  return json({ isAuth });
};

export default function RecipeWritePage() {
  const router = useRouter();
  const [imagePath, setImagePath] = useState<string | null>(null);
  const { form, errorMessage, changeErrorMessage, changeThumbnail, resetForm } = useRecipeStore();
  const { handleChangeTitle, handleChangeDescription } = useRecipeHandler();

  const recipeCreateMutation = useMutation((request: RecipeCreateRequest) => postRecipe(request), {
    onSuccess: ({ id }) => {
      router.push(`/recipe/edit?id=${id}`);
    },
    onError: () => {
      changeErrorMessage('레시피 작성에 실패했습니다.');
    },
  });

  const handleSubmitRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title) {
      changeErrorMessage('제목을 입력해주세요.');
      return;
    }

    if (!form.description) {
      changeErrorMessage('설명을 입력해주세요.');
      return;
    }

    await recipeCreateMutation.mutateAsync(form);
    resetForm();
  };

  const handleClickThumbnail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = await upload();
    if (!file) return;
    const fileURL = URL.createObjectURL(file);
    setImagePath(fileURL);
    changeThumbnail(file);
  };

  useEffect(() => {
    resetForm();
  }, [resetForm, router.asPath]);

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeForm
          onSubmit={handleSubmitRecipe}
          buttonText="레시피 작성하기"
          errorMessage={errorMessage}
        >
          <RecipeEditor
            title={form.title}
            imagePath={imagePath}
            onClickImage={handleClickThumbnail}
            onChangeTitle={handleChangeTitle}
            onChangeDescription={handleChangeDescription}
          />
        </RecipeForm>
      </ContentLayout>
    </MainLayout>
  );
}

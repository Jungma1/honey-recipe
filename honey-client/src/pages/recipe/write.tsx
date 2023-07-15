import { useMutation } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { postRecipe } from '~/apis/recipe';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeContent from '~/components/recipe/RecipeContent';
import RecipeFormTemplate from '~/components/recipe/RecipeFormTemplate';
import RecipeThumbnailSelector from '~/components/recipe/RecipeThumbnailSelector';
import { useRecipeForm } from '~/components/recipe/hooks/useRecipeForm';
import { useImageFileSelector } from '~/hooks/useImageFileSelector';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';
import { redirect } from '~/utils/route';

export default function RecipeWritePage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const { form, handleChangeTitle, handleChangeDescription } = useRecipeForm();
  const { imagePath, imageFile, handleClickImageFileSelector } = useImageFileSelector();

  const postRecipeMutation = useMutation((formData: FormData) => postRecipe(formData), {
    onSuccess: ({ id }) => {
      router.push(`/recipe/edit?id=${id}`);
    },
    onError: () => {
      setErrorMessage('레시피 작성에 실패했습니다.');
    },
  });

  const handleSubmitRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title) {
      setErrorMessage('제목을 입력해주세요.');
      return;
    }

    if (!form.description) {
      setErrorMessage('설명을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    if (imageFile) formData.append('thumbnail', imageFile);

    await postRecipeMutation.mutateAsync(formData);
  };

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeFormTemplate
          onSubmit={handleSubmitRecipe}
          buttonText="레시피 작성하기"
          errorMessage={errorMessage}
        >
          <RecipeThumbnailSelector
            imagePath={imagePath}
            imageFile={imageFile}
            onClickThumbnail={handleClickImageFileSelector}
          />
          <RecipeContent
            title={form.title}
            onChangeTitle={handleChangeTitle}
            onChangeDescription={handleChangeDescription}
          />
        </RecipeFormTemplate>
      </ContentLayout>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { isAuth } = validateTokenCookie(context);
  if (!isAuth) return redirect('/login');
  return json({ isAuth });
};

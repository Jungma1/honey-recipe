import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeContent from '~/components/recipe/RecipeContent';
import RecipeFormTemplate from '~/components/recipe/RecipeFormTemplate';
import RecipeThumbnailSelector from '~/components/recipe/RecipeThumbnailSelector';
import { useRecipeCreateMutation } from '~/hooks/mutations/recipe';
import { useImageFileSelector } from '~/hooks/useImageFileSelector';
import { useRecipeForm } from '~/hooks/useRecipeForm';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';
import { redirect } from '~/utils/route';

export default function RecipeWritePage() {
  const [errorMessage, setErrorMessage] = useState('');
  const { form, handleChangeTitle, handleChangeDescription } = useRecipeForm();
  const { imagePath, imageFile, handleClickImageFileSelector } = useImageFileSelector();

  const recipeCreateMutation = useRecipeCreateMutation({
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

    await recipeCreateMutation.mutateAsync({
      title: form.title,
      description: form.description,
      thumbnail: imageFile,
    });
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

import { GetServerSideProps } from 'next';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeEditor from '~/components/recipe/RecipeEditor';
import RecipeFormTemplate from '~/components/recipe/RecipeFormTemplate';
import RecipeImageSelector from '~/components/recipe/RecipeImageSelector';
import { useRecipeHandler } from '~/components/recipe/hooks/useRecipeHandler';
import { useRecipeCreateMutation } from '~/hooks/mutations/recipe';
import { useImageFileSelector } from '~/hooks/useImageFileSelector';
import { useRecipeStore } from '~/stores/recipe';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

export default function RecipeWritePage() {
  const { form, errorMessage, changeErrorMessage, changeThumbnail } = useRecipeStore();
  const { handleChangeTitle, handleChangeDescription } = useRecipeHandler();
  const { imagePath, imageFile, handleClickImageFileSelector } = useImageFileSelector();
  const recipeCreateMutation = useRecipeCreateMutation();

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

    changeThumbnail(imageFile);

    await recipeCreateMutation.mutateAsync(form);
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
          <RecipeImageSelector
            imagePath={imagePath}
            onClickThumbnail={handleClickImageFileSelector}
          />
          <RecipeEditor
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

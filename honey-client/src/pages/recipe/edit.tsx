import { useMutation } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { getRecipe, patchRecipe, patchRecipeThumbnail } from '~/apis/recipe';
import { RecipeUpdateRequest } from '~/apis/types';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeCourseEditor from '~/components/recipe/RecipeCourseEditor';
import RecipeEditor from '~/components/recipe/RecipeEditor';
import RecipeForm from '~/components/recipe/RecipeForm';
import { validateTokenCookie } from '~/utils/cookie';
import { upload } from '~/utils/file';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { isAuth } = validateTokenCookie(context);
  if (!isAuth) return redirect('/login');

  if (!context.query.id) return redirect('/');
  const id = parseInt(context.query.id as string);
  const recipe = await getRecipe(id);

  return json({ isAuth, recipe });
};

export default function RecipeEditPage({
  recipe,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: recipe.title,
    description: recipe.description,
  });
  const [thumbnail, setThumbnail] = useState(recipe.thumbnail);
  const [errorMessage, setErrorMessage] = useState('');

  const recipeUpdateMutation = useMutation(
    (request: RecipeUpdateRequest) => patchRecipe(recipe.id, request),
    {
      onSuccess: () => {
        router.push(`/recipe/${recipe.id}`);
      },
      onError: () => {
        setErrorMessage('레시피 수정에 실패했습니다.');
      },
    }
  );

  const recipeUpdateThumbnailMutation = useMutation(
    (file: File) => patchRecipeThumbnail(recipe.id, file),
    {
      onSuccess: ({ thumbnail }) => {
        setThumbnail(thumbnail);
      },
      onError: () => {
        setErrorMessage('썸네일 업로드에 실패했습니다.');
      },
    }
  );

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, title: e.target.value });
  };

  const handleChangeDescription = (value: string) => {
    setForm({ ...form, description: value });
  };

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

    await recipeUpdateMutation.mutateAsync(form);
  };

  const handleClickThumbnail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = await upload();
    if (!file) return;
    await recipeUpdateThumbnailMutation.mutateAsync(file);
  };

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeForm
          onSubmit={handleSubmitRecipe}
          buttonText="레시피 수정하기"
          errorMessage={errorMessage}
        >
          <RecipeEditor
            title={form.title}
            imagePath={thumbnail}
            onClickImage={handleClickThumbnail}
            description={form.description}
            onChangeTitle={handleChangeTitle}
            onChangeDescription={handleChangeDescription}
          />
          <RecipeCourseEditor />
        </RecipeForm>
      </ContentLayout>
    </MainLayout>
  );
}

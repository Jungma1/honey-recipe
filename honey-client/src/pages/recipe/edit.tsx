import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import React, { useState } from 'react';
import { getRecipe, patchRecipe, postRecipeImage } from '~/apis/recipe';
import { RecipeUpdateRequest } from '~/apis/types';
import Header from '~/components/common/Header';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeCourseAddButton from '~/components/recipe/RecipeCourseAddButton';
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
  const [form, setForm] = useState<RecipeUpdateRequest>({
    title: recipe.title,
    description: recipe.description,
    thumbnail: recipe.thumbnail,
    course: [],
  });
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
    (file: File) => postRecipeImage(recipe.id, file),
    {
      onSuccess: ({ imagePath }) => {
        setForm({ ...form, thumbnail: imagePath });
      },
      onError: () => {
        setErrorMessage('썸네일 업로드에 실패했습니다.');
      },
    }
  );

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, title: e.target.value });
  };

  const onChangeDescription = (value: string) => {
    setForm({ ...form, description: value });
  };

  const onSubmitRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
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

  const onClickThumbnail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = await upload();
    if (!file) return;
    await recipeUpdateThumbnailMutation.mutateAsync(file);
  };

  const onChangeCourse = (id: number, key: string, value: string) => {
    setForm({
      ...form,
      course: form.course.map((course) =>
        course.id === id ? { ...course, [key]: value } : course
      ),
    });
  };

  const onClickPicture = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = await upload();
    if (!file) return;
    console.log(file);
  };

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeForm
          onSubmit={onSubmitRecipe}
          buttonText="레시피 수정하기"
          errorMessage={errorMessage}
        >
          <RecipeEditor
            title={form.title}
            imagePath={form.thumbnail}
            onClickImage={onClickThumbnail}
            description={form.description}
            onChangeTitle={onChangeTitle}
            onChangeDescription={onChangeDescription}
          />
          <Block>
            {form.course.map((course) => (
              <RecipeCourseEditor
                key={course.id}
                course={course}
                onChangeForm={onChangeCourse}
                onClickPicture={onClickPicture}
              />
            ))}
            <RecipeCourseAddButton />
          </Block>
        </RecipeForm>
      </ContentLayout>
    </MainLayout>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};
`;

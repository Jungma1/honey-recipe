import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import React from 'react';
import { withSSR } from '~/apis';
import { getRecipe, patchRecipe } from '~/apis/recipe';
import { getProfile } from '~/apis/user';
import Header from '~/components/common/Header';
import TitleGroup from '~/components/common/TitleGroup';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeCourseAddButton from '~/components/recipe/RecipeCourseAddButton';
import RecipeCourseEditor from '~/components/recipe/RecipeCourseEditor';
import RecipeEditor from '~/components/recipe/RecipeEditor';
import RecipeForm from '~/components/recipe/RecipeForm';
import { useRecipeForm } from '~/components/recipe/hooks/useRecipeForm';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

interface Props extends InferGetServerSidePropsType<typeof getServerSideProps> {}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withSSR(() => getProfile(), context);
  if (!user) return redirect('/login');

  if (!context.query.id) return redirect('/');
  const id = parseInt(context.query.id as string);

  const recipe = await getRecipe(id);
  if (recipe.user.id !== user.id) return redirect('/404');

  return json({ user, recipe });
};

export default function RecipeEditPage({ recipe }: Props) {
  const router = useRouter();
  const {
    form,
    validationForm,
    handleChangeTitle,
    handleChangeDescription,
    handleChangeContent,
    handleClickAddCourse,
    handleClickRemoveCourse,
    handleClickRemovePicture,
    handleClickThumbnail,
    handleClickPicture,
    handleClickIsPublic,
    handleClickIsPrivate,
  } = useRecipeForm(recipe);

  const { mutateAsync: updateRecipe } = useMutation(patchRecipe, {
    onSuccess: () => {
      router.push(`/recipe/${recipe.id}`);
    },
  });

  const handleSubmitRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isValid = validationForm();
    if (!isValid) return;

    await updateRecipe({
      id: recipe.id,
      request: form,
    });
  };

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeForm onSubmit={handleSubmitRecipe} buttonText="레시피 수정하기">
          <TitleGroup title="레시피 정보">
            <RecipeEditor
              title={form.title}
              imagePath={form.thumbnail}
              isPrivate={form.isPrivate}
              onClickImage={handleClickThumbnail}
              description={form.description}
              onChangeTitle={handleChangeTitle}
              onChangeDescription={handleChangeDescription}
              onClickIsPublic={handleClickIsPublic}
              onClickIsPrivate={handleClickIsPrivate}
            />
          </TitleGroup>
          <TitleGroup title="레시피 과정">
            <Block>
              {form.course.map((course, index) => (
                <RecipeCourseEditor
                  key={course.id}
                  step={index + 1}
                  course={course}
                  onChangeContent={handleChangeContent}
                  onClickRemove={handleClickRemoveCourse}
                  onClickImage={handleClickPicture}
                  onClickRemoveImage={handleClickRemovePicture}
                />
              ))}
              <RecipeCourseAddButton onClick={handleClickAddCourse} />
            </Block>
          </TitleGroup>
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

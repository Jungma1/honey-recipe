import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { withSSR } from '~/apis';
import { getRecipe, patchRecipe } from '~/apis/recipe';
import { getProfile } from '~/apis/user';
import Header from '~/components/common/Header';
import TitleGroup from '~/components/common/TitleGroup';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeCourseAddButton from '~/components/recipe/course/RecipeCourseAddButton';
import RecipeCourseEditor from '~/components/recipe/course/RecipeCourseEditor';
import RecipePublish from '~/components/recipe/publish/RecipePublish';
import RecipeEditor from '~/components/recipe/RecipeEditor';
import RecipeTemplate from '~/components/recipe/RecipeTemplate';
import { useEditorStore } from '~/stores/editor';
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
  const form = useEditorStore((state) => state.getForm());
  const { courses, setForm, resetForm, openPublish } = useEditorStore();

  const { mutateAsync: updateRecipe } = useMutation(patchRecipe, {
    onSuccess: () => {
      router.push(`/recipe/${recipe.id}`);
    },
  });

  const handleClickButton = () => {
    if (!form.title || !form.description) {
      return toast.error('레시피 이름 또는 설명을 입력해주세요.');
    }
    openPublish();
  };

  const handleUpdateRecipe = () => {
    updateRecipe({
      id: recipe.id,
      request: form,
    });
  };

  useEffect(() => {
    setForm(recipe);
  }, [recipe, setForm]);

  useEffect(() => {
    return () => resetForm();
  }, [resetForm]);

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeTemplate buttonText="레시피 수정하기" onClickButton={handleClickButton}>
          <TitleGroup title="레시피 정보">
            <RecipeEditor />
          </TitleGroup>
          <TitleGroup title="레시피 과정">
            <Block>
              {courses.map((course, index) => (
                <RecipeCourseEditor key={course.id} step={index} course={course} />
              ))}
              <RecipeCourseAddButton />
            </Block>
          </TitleGroup>
        </RecipeTemplate>
      </ContentLayout>
      <RecipePublish onConfirm={handleUpdateRecipe} isEdit />
    </MainLayout>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};
`;

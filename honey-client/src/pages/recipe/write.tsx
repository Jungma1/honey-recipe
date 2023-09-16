import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { withSSR } from '~/apis';
import { postRecipe } from '~/apis/recipe';
import { getProfile } from '~/apis/user';
import Header from '~/components/common/Header';
import TitleGroup from '~/components/common/TitleGroup';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeCourseAddButton from '~/components/recipe/course/RecipeCourseAddButton';
import RecipeCourseEditor from '~/components/recipe/course/RecipeCourseEditor';
import RecipePublish from '~/components/recipe/publish/RecipePublish';
import RecipeEditor from '~/components/recipe/RecipeEditor';
import RecipeForm from '~/components/recipe/RecipeForm';
import { useEditorStore } from '~/stores/editor';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const user = await withSSR(() => getProfile(), context);
  if (!user) return redirect('/login');
  return json({ user });
};

export default function RecipeWritePage() {
  const router = useRouter();
  const { courses, resetForm, openPublish } = useEditorStore();
  const form = useEditorStore((state) => state.getForm());

  const { mutateAsync: createRecipe } = useMutation(postRecipe, {
    onSuccess: ({ id }) => {
      router.push(`/recipe/${id}`);
    },
  });

  const handleSubmitRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      return toast.error('레시피 이름 또는 설명을 입력해주세요.');
    }
    openPublish();
  };

  useEffect(() => {
    return () => resetForm();
  }, [resetForm]);

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeForm onSubmit={handleSubmitRecipe} buttonText="레시피 작성하기">
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
        </RecipeForm>
      </ContentLayout>
      <RecipePublish />
    </MainLayout>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};
`;

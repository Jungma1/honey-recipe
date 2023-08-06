import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { postRecipe } from '~/apis/recipe';
import Header from '~/components/common/Header';
import TitleGroup from '~/components/common/TitleGroup';
import ContentLayout from '~/components/layout/ContentLayout';
import MainLayout from '~/components/layout/MainLayout';
import RecipeCourseAddButton from '~/components/recipe/RecipeCourseAddButton';
import RecipeCourseEditor from '~/components/recipe/RecipeCourseEditor';
import RecipeEditor from '~/components/recipe/RecipeEditor';
import RecipeForm from '~/components/recipe/RecipeForm';
import { useRecipe } from '~/components/recipe/hooks/useRecipe';
import { validateTokenCookie } from '~/utils/cookie';
import { json } from '~/utils/json';
import { redirect } from '~/utils/router';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { isAuth } = validateTokenCookie(context);
  if (!isAuth) return redirect('/login');
  return json({ isAuth });
};

export default function RecipeWritePage() {
  const router = useRouter();
  const {
    form,
    errorMessage,
    setErrorMessage,
    onChangeTitle,
    onChangeDescription,
    onChangeContent,
    onClickAddCourse,
    onClickRemoveCourse,
    onClickRemovePicture,
    onClickThumbnail,
    onClickPicture,
  } = useRecipe();

  const { mutateAsync: createRecipe } = useMutation(postRecipe, {
    onSuccess: ({ id }) => {
      router.push(`/recipe/${id}`);
    },
    onError: () => {
      setErrorMessage('레시피 작성에 실패했습니다.');
    },
  });

  const onSubmitRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.title) {
      return setErrorMessage('제목을 입력해주세요.');
    }

    if (!form.description) {
      return setErrorMessage('설명을 입력해주세요.');
    }

    await createRecipe(form);
  };

  return (
    <MainLayout>
      <Header />
      <ContentLayout>
        <RecipeForm
          onSubmit={onSubmitRecipe}
          buttonText="레시피 작성하기"
          errorMessage={errorMessage}
        >
          <TitleGroup title="레시피 정보">
            <RecipeEditor
              title={form.title}
              imagePath={form.thumbnail}
              onClickImage={onClickThumbnail}
              onChangeTitle={onChangeTitle}
              onChangeDescription={onChangeDescription}
            />
          </TitleGroup>
          <TitleGroup title="레시피 과정">
            <Block>
              {form.course.map((course, index) => (
                <RecipeCourseEditor
                  key={course.id}
                  step={index + 1}
                  course={course}
                  onChangeContent={onChangeContent}
                  onClickRemove={onClickRemoveCourse}
                  onClickImage={onClickPicture}
                  onClickRemoveImage={onClickRemovePicture}
                />
              ))}
              <RecipeCourseAddButton onClick={onClickAddCourse} />
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

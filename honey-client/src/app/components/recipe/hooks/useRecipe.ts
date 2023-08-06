import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { postRecipeImage } from '~/apis/recipe';
import { RecipeRead, RecipeRequest } from '~/apis/types';
import { upload } from '~/utils/file';

export function useRecipe(recipe?: RecipeRead) {
  const [form, setForm] = useState<RecipeRequest>({
    title: recipe?.title ?? '',
    description: recipe?.description ?? '',
    thumbnail: recipe?.thumbnail ?? null,
    course: recipe?.course ?? [],
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const { mutateAsync: uploadImage } = useMutation(postRecipeImage, {
    onSuccess: ({ imagePath }) => {
      if (selectedCourseId) {
        setForm({
          ...form,
          course: form.course.map((course) =>
            course.id === selectedCourseId ? { ...course, picture: imagePath } : course
          ),
        });
        setSelectedCourseId(null);
      } else {
        setForm({ ...form, thumbnail: imagePath });
      }
    },
    onError: () => {
      setErrorMessage('이미지 업로드에 실패했습니다.');
    },
  });

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, title: e.target.value });
  };

  const onChangeDescription = (value: string) => {
    setForm({ ...form, description: value });
  };

  const onChangeContent = (id: number, value: string) => {
    setForm({
      ...form,
      course: form.course.map((course) =>
        course.id === id ? { ...course, content: value } : course
      ),
    });
  };

  const onClickRemoveCourse = (id: number) => {
    setForm({
      ...form,
      course: form.course.filter((course) => course.id !== id),
    });
  };

  const onClickRemovePicture = (id: number) => {
    setForm({
      ...form,
      course: form.course.map((course) =>
        course.id === id ? { ...course, picture: null } : course
      ),
    });
  };

  const onClickAddCourse = () => {
    setForm({
      ...form,
      course: [...form.course, { id: Math.random(), content: '', picture: null, created: false }],
    });
  };

  const onClickThumbnail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = await upload();
    if (!file) return;
    await uploadImage(file);
  };

  const onClickPicture = async (id: number) => {
    const file = await upload();
    if (!file) return;
    setSelectedCourseId(id);
    await uploadImage(file);
  };

  return {
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
  };
}

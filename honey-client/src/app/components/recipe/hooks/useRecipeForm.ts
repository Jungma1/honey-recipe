import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { postRecipeImage } from '~/apis/recipe';
import { RecipeRead, RecipeRequest } from '~/apis/types';
import { upload } from '~/utils/file';

export function useRecipeForm(recipe?: RecipeRead) {
  const [form, setForm] = useState<RecipeRequest>({
    title: recipe?.title ?? '',
    description: recipe?.description ?? '',
    thumbnail: recipe?.thumbnail ?? null,
    isPrivate: recipe?.isPrivate ?? false,
    course: recipe?.course ?? [],
  });
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
    onError: () => {},
  });

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, title: e.target.value });
  };

  const onChangeDescription = (value: string) => {
    setForm({ ...form, description: value });
  };

  const onClickIsPublic = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setForm({ ...form, isPrivate: false });
  };

  const onClickIsPrivate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setForm({ ...form, isPrivate: true });
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

  const validationForm = () => {
    if (!form.title) {
      toast.error('레시피 제목을 입력해주세요.');
      return false;
    }

    if (!form.description) {
      toast.error('레시피 설명을 입력해주세요.');
      return false;
    }
    return true;
  };

  return {
    form,
    validationForm,
    onChangeTitle,
    onChangeDescription,
    onChangeContent,
    onClickAddCourse,
    onClickRemoveCourse,
    onClickRemovePicture,
    onClickThumbnail,
    onClickPicture,
    onClickIsPublic,
    onClickIsPrivate,
  };
}

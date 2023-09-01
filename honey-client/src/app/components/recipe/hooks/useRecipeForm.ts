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

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, title: e.target.value });
  };

  const handleChangeDescription = (value: string) => {
    setForm({ ...form, description: value });
  };

  const handleClickIsPublic = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setForm({ ...form, isPrivate: false });
  };

  const handleClickIsPrivate = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setForm({ ...form, isPrivate: true });
  };

  const handleChangeContent = (id: number, value: string) => {
    setForm({
      ...form,
      course: form.course.map((course) =>
        course.id === id ? { ...course, content: value } : course
      ),
    });
  };

  const handleClickRemoveCourse = (id: number) => {
    setForm({
      ...form,
      course: form.course.filter((course) => course.id !== id),
    });
  };

  const handleClickRemovePicture = (id: number) => {
    setForm({
      ...form,
      course: form.course.map((course) =>
        course.id === id ? { ...course, picture: null } : course
      ),
    });
  };

  const handleClickAddCourse = () => {
    setForm({
      ...form,
      course: [...form.course, { id: Math.random(), content: '', picture: null, created: false }],
    });
  };

  const handleClickThumbnail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = await upload();
    if (!file) return;
    await uploadImage(file);
  };

  const handleClickPicture = async (id: number) => {
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
  };
}

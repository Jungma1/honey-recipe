import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import React, { useState } from 'react';
import { postRecipe } from '~/apis/recipe';
import { colors } from '~/utils/colors';
import AutoImage from '../system/AutoImage';
import Button from '../system/Button';
import Editor from '../system/Editor';
import Input from '../system/Input';
import LabelGroup from '../system/LabelGroup';

function RecipeForm() {
  const router = useRouter();
  const [imagePath, setImagePath] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setFrom] = useState({
    title: '',
    description: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const postRecipeMutation = useMutation((formData: FormData) => postRecipe(formData), {
    onSuccess: ({ id }) => {
      router.push(`/recipe/edit?id=${id}`);
    },
    onError: () => {
      setErrorMessage('레시피 작성에 실패했습니다.');
    },
  });

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrom((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleChangeDescription = (value: string) => {
    setFrom((prev) => ({ ...prev, description: value }));
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

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    if (imageFile) formData.append('thumbnail', imageFile);

    await postRecipeMutation.mutateAsync(formData);
  };

  const handleClickThumbnail = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg';
    input.onchange = (e) => {
      if (!input.files) return;

      const file = input.files[0];
      const imageURL = URL.createObjectURL(file);
      setImagePath(imageURL);
      setImageFile(file);
    };
    input.click();
  };

  return (
    <Form onSubmit={handleSubmitRecipe}>
      <Wrapper>
        <FirstWrapper>
          <AutoImage src={imageFile ? imagePath : '/test.png'} />
          <ThumbnailButton onClick={handleClickThumbnail} outlined>
            썸네일 업로드
          </ThumbnailButton>
        </FirstWrapper>
        <SecondWrapper>
          <LabelGroup label="제목">
            <Input value={form.title} onChange={handleChangeTitle} />
          </LabelGroup>
          <LabelGroup label="설명">
            <Editor onChange={handleChangeDescription} />
          </LabelGroup>
        </SecondWrapper>
      </Wrapper>
      <SubmitButton>레시피 작성하기</SubmitButton>
      {errorMessage && (
        <ErrorMessage initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {errorMessage}
        </ErrorMessage>
      )}
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${rem(32)};
`;

const FirstWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};
`;

const ThumbnailButton = styled(Button)`
  font-size: ${rem(16)};
`;

const SecondWrapper = styled.div`
  flex: auto;
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};

  div:nth-child(2) {
    flex: 1;
  }
`;

const SubmitButton = styled(Button)`
  height: ${rem(48)};
  font-size: ${rem(18)};
`;

const ErrorMessage = styled(motion.div)`
  text-align: center;
  color: ${colors.danger};
  font-weight: bold;
`;

export default RecipeForm;

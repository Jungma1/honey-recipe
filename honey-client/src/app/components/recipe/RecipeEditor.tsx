import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { rem } from 'polished';
import React from 'react';
import { postRecipeImage } from '~/apis/recipe';
import { defaultPictureImage } from '~/static';
import { useEditorStore } from '~/stores/editor';
import { upload } from '~/utils/file';
import Editor from '../common/Editor';
import LabelGroup from '../common/LabelGroup';
import AutoImage from '../system/AutoImage';
import Button from '../system/Button';
import Input from '../system/Input';

function RecipeEditor() {
  const { title, description, thumbnail, setTitle, setDescription, setThumbnail } =
    useEditorStore();

  const { mutateAsync: uploadThumbnail, isLoading } = useMutation(postRecipeImage, {
    onSuccess: ({ imagePath }) => {
      setThumbnail(imagePath);
    },
  });

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeDescription = (description: string) => {
    setDescription(description);
  };

  const handleUploadThumbnail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const file = await upload();
    if (!file) return;
    await uploadThumbnail(file);
  };

  const handleRemoveThumbnail = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setThumbnail(null);
  };

  return (
    <Block>
      <ImageWrapper>
        <AutoImage src={thumbnail ?? defaultPictureImage} />
        <ButtonGroup>
          <Button onClick={handleUploadThumbnail} disabled={isLoading}>
            {!isLoading ? '이미지 업로드' : '이미지 업로드 중...'}
          </Button>
          <Button onClick={handleRemoveThumbnail} disabled={isLoading} outlined>
            이미지 삭제
          </Button>
        </ButtonGroup>
      </ImageWrapper>
      <InfoWrapper>
        <LabelGroup label="레시피 이름">
          <Input value={title} onChange={handleChangeTitle} />
        </LabelGroup>
        <LabelGroup label="레시피 설명">
          <Editor onChangeValue={handleChangeDescription} defaultValue={description} />
        </LabelGroup>
      </InfoWrapper>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  gap: ${rem(32)};
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};

  img {
    border-radius: ${rem(4)};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(8)};
`;

const InfoWrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};

  div:last-of-type {
    flex: 1;
  }
`;

export default RecipeEditor;

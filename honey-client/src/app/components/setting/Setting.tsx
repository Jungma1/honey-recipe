import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { rem } from 'polished';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { User } from '~/apis/types';
import { deleteProfileImage, patchProfile, patchProfileImage } from '~/apis/user';
import { defaultProfileImage } from '~/static';
import { useUserStore } from '~/stores/user';
import { colors } from '~/utils/colors';
import { upload } from '~/utils/file';
import LabelGroup from '../common/LabelGroup';
import TitleGroup from '../common/TitleGroup';
import AutoImage from '../system/AutoImage';
import Button from '../system/Button';
import Input from '../system/Input';

interface Props {
  profile: User;
}

function Setting({ profile }: Props) {
  const { setUser } = useUserStore();
  const [profileImage, setProfileImage] = useState(profile.picture);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      handle: profile.handle,
      username: profile.username,
    },
  });

  const { mutateAsync: updateProfile } = useMutation(patchProfile, {
    onSuccess: (user) => {
      setUser(user);
      toast.success('프로필 정보가 수정되었습니다.');
    },
  });

  const { mutateAsync: updateProfileImage, isLoading } = useMutation(patchProfileImage, {
    onSuccess: (user) => {
      setUser(user);
      setProfileImage(user.picture);
      toast.success('프로필 이미지가 수정되었습니다.');
    },
  });

  const { mutateAsync: removeProfileImage } = useMutation(deleteProfileImage, {
    onSuccess: (user) => {
      setUser(user);
      setProfileImage(null);
    },
  });

  const handleClickUpdateProfileImage = async () => {
    const file = await upload();
    if (!file) return;
    await updateProfileImage(file);
  };

  const handleClickRemoveProfileImage = async () => {
    await removeProfileImage();
  };

  const handleSubmitProfile = handleSubmit(async (request) => {
    await updateProfile({
      request,
    });
  });

  const usernameRegister = register('username', {
    required: { value: true, message: '사용자 이름을 입력해주세요.' },
    maxLength: { value: 20, message: '20자 이내로 입력해주세요.' },
    pattern: {
      value: /^[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣0-9 ]+$/,
      message: '한글, 영문(대소문자), 숫자만 입력 가능합니다.',
    },
  });

  const handleRegister = register('handle', {
    required: { value: true, message: '사용자 URL을 입력해주세요.' },
    maxLength: { value: 20, message: '20자 이내로 입력해주세요.' },
    pattern: {
      value: /^[A-Za-z0-9\-_]+$/,
      message: '영문(대소문자), 숫자, 특수문자(-, _)만 입력 가능합니다.',
    },
  });

  return (
    <Block>
      <TitleGroup title="프로필 이미지">
        <ImageWrapper>
          <ImageLeft>
            <AutoImage src={profileImage ?? defaultProfileImage} />
          </ImageLeft>
          <ImageRight>
            <ButtonGroup>
              <Button onClick={handleClickUpdateProfileImage} disabled={isLoading}>
                {!isLoading ? '프로필 이미지 업데이트' : '이미지 업로드 중...'}
              </Button>
              <Button onClick={handleClickRemoveProfileImage} outlined>
                이미지 삭제
              </Button>
            </ButtonGroup>
            <div>2MB 이내의 JPEG, PNG 형식의 이미지만 업로드 가능합니다.</div>
          </ImageRight>
        </ImageWrapper>
      </TitleGroup>
      <TitleGroup title="프로필 정보">
        <StyledForm onSubmit={handleSubmitProfile}>
          <LabelGroup label="사용자 이름">
            <Input {...usernameRegister} />
            {errors.username && <ErrorMessage>{errors.username?.message}</ErrorMessage>}
          </LabelGroup>
          <LabelGroup label="사용자 URL">
            <Input {...handleRegister} />
            {errors.handle && <ErrorMessage>{errors.handle?.message}</ErrorMessage>}
          </LabelGroup>
          <Button>정보 수정하기</Button>
        </StyledForm>
      </TitleGroup>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(64)};
`;

const ImageWrapper = styled.div`
  display: flex;
  gap: ${rem(32)};
`;

const ImageLeft = styled.div`
  flex: 1;

  img {
    border-radius: ${rem(4)};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${rem(8)};
  margin-bottom: ${rem(16)};
`;

const ImageRight = styled.div`
  flex: 3;
  color: ${colors.gray9};
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};
`;

const ErrorMessage = styled.span`
  margin-top: ${rem(8)};
  font-size: ${rem(14)};
  font-weight: 600;
  color: ${colors.danger};
`;

export default Setting;

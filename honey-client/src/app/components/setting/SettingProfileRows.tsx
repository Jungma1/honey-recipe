import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { rem } from 'polished';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { patchProfile } from '~/apis/user';
import { useUserStore } from '~/stores/user';
import { colors } from '~/utils/colors';
import LabelGroup from '../common/LabelGroup';
import TitleGroup from '../common/TitleGroup';
import Button from '../system/Button';
import Input from '../system/Input';

function SettingProfileRows() {
  const { user, setUser } = useUserStore();
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      handle: user?.handle ?? '',
      username: user?.username ?? '',
    },
  });

  const { mutateAsync: updateProfile } = useMutation(patchProfile, {
    onSuccess: (user) => {
      setUser(user);
      toast.success('프로필 정보가 수정되었습니다.');
    },
  });

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

  useEffect(() => {
    if (!user) return;
    setValue('handle', user.handle);
    setValue('username', user.username);
  }, [setValue, user]);

  return (
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
  );
}

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

export default SettingProfileRows;

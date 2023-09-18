import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { rem } from 'polished';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { deleteProfileImage, patchProfileImage } from '~/apis/user';
import { defaultProfileImage } from '~/static';
import { useUserStore } from '~/stores/user';
import { colors } from '~/utils/colors';
import { upload } from '~/utils/file';
import TitleGroup from '../common/TitleGroup';
import AutoImage from '../system/AutoImage';
import Button from '../system/Button';

function SettingProfileImage() {
  const { user, setUser } = useUserStore();
  const [profileImage, setProfileImage] = useState(user?.picture);

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

  return (
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
  );
}

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

export default SettingProfileImage;

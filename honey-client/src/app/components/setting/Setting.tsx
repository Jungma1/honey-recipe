import styled from '@emotion/styled';
import { useMutation } from '@tanstack/react-query';
import { rem } from 'polished';
import { useState } from 'react';
import { User } from '~/apis/types';
import { patchProfilePicture } from '~/apis/user';
import { colors } from '~/utils/colors';
import { upload } from '~/utils/file';
import TitleGroup from '../common/TitleGroup';
import AutoImage from '../system/AutoImage';
import Button from '../system/Button';

interface Props {
  profile: User;
}

function Setting({ profile }: Props) {
  const [info, setInfo] = useState<User>({
    id: profile.id,
    handle: profile.handle,
    picture: profile.picture,
    username: profile.username,
  });

  const { mutateAsync: uploadPicture } = useMutation(patchProfilePicture, {
    onSuccess: ({ imagePath }) => {
      setInfo({ ...profile, picture: imagePath });
    },
  });

  const onClickPicture = async () => {
    const file = await upload();
    if (!file) return;
    await uploadPicture(file);
  };

  return (
    <Block>
      <TitleGroup title="프로필 이미지">
        <ImageWrapper>
          <ImageLeft>
            <AutoImage src={info.picture ?? '/test.png'} />
          </ImageLeft>
          <ImageRight>
            <StyledButton onClick={onClickPicture} twoTone>
              프로필 이미지 업데이트
            </StyledButton>
            <div>2MB 이내의 JPEG, PNG 형식의 이미지만 업로드 가능합니다.</div>
          </ImageRight>
        </ImageWrapper>
      </TitleGroup>
      <TitleGroup title="프로필 정보">
        <div>Info</div>
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

const StyledButton = styled(Button)`
  font-size: ${rem(16)};
  margin-bottom: ${rem(16)};
`;

const ImageRight = styled.div`
  flex: 3;
  color: ${colors.gray9};
`;

export default Setting;

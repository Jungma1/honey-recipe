import styled from '@emotion/styled';
import { rem } from 'polished';
import { defaultPictureImage } from '~/static';
import AutoImage from '../system/AutoImage';
import Button from '../system/Button';

interface Props {
  imagePath: string | null;
  onClickUpload: React.MouseEventHandler<HTMLButtonElement>;
  onClickRemove: React.MouseEventHandler<HTMLButtonElement>;
}

function RecipeImageSelector({ imagePath, onClickUpload, onClickRemove }: Props) {
  return (
    <Block>
      <AutoImage src={imagePath ?? defaultPictureImage} />
      <ButtonGroup>
        <StyledButton onClick={onClickUpload}>이미지 업로드</StyledButton>
        <StyledButton onClick={onClickRemove} outlined>
          이미지 삭제
        </StyledButton>
      </ButtonGroup>
    </Block>
  );
}

const Block = styled.div`
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

const StyledButton = styled(Button)`
  font-size: ${rem(16)};
`;

export default RecipeImageSelector;

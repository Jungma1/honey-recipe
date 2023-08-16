import styled from '@emotion/styled';
import { rem } from 'polished';
import { defaultPictureImage } from '~/static';
import AutoImage from '../system/AutoImage';
import Button from '../system/Button';

interface Props {
  imagePath: string | null;
  onClickImage: React.MouseEventHandler<HTMLButtonElement>;
}

function RecipeImageSelector({ imagePath, onClickImage }: Props) {
  return (
    <Block>
      <AutoImage src={imagePath ?? defaultPictureImage} />
      <ThumbnailButton onClick={onClickImage} twoTone>
        썸네일 업로드
      </ThumbnailButton>
    </Block>
  );
}

const Block = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};

  img {
    border-radius: ${rem(8)};
  }
`;

const ThumbnailButton = styled(Button)`
  font-size: ${rem(16)};
`;

export default RecipeImageSelector;

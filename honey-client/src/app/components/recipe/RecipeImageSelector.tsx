import styled from '@emotion/styled';
import { rem } from 'polished';
import AutoImage from '../system/AutoImage';
import Button from '../system/Button';

interface Props {
  imagePath: string | null;
  onClickImage: React.MouseEventHandler<HTMLButtonElement>;
}

function RecipeImageSelector({ imagePath, onClickImage }: Props) {
  return (
    <Block>
      <AutoImage src={imagePath ?? '/test.png'} />
      <ThumbnailButton onClick={onClickImage} towTone>
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
`;

const ThumbnailButton = styled(Button)`
  font-size: ${rem(16)};
`;

export default RecipeImageSelector;

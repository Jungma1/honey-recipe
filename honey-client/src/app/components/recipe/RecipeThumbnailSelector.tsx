import styled from '@emotion/styled';
import { rem } from 'polished';
import AutoImage from '../system/AutoImage';
import Button from '../system/Button';

interface Props {
  imagePath: string;
  imageFile: File | null;
  onClickThumbnail: React.MouseEventHandler<HTMLButtonElement>;
}

function RecipeThumbnailSelector({ imagePath, imageFile, onClickThumbnail }: Props) {
  return (
    <Block>
      <AutoImage src={imageFile ? imagePath : '/test.png'} />
      <ThumbnailButton onClick={onClickThumbnail} outlined>
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

export default RecipeThumbnailSelector;

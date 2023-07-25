import styled from '@emotion/styled';
import Image, { ImageProps } from 'next/image';

interface Props extends Omit<ImageProps, 'width' | 'height' | 'alt'> {}

function AutoImage({ ...rest }: Props) {
  return (
    <Block>
      <Image {...rest} fill priority style={{ objectFit: 'cover' }} alt="" />
    </Block>
  );
}

const Block = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
`;

export default AutoImage;

import styled from '@emotion/styled';
import Image, { ImageProps } from 'next/image';

interface Props extends Omit<ImageProps, 'width' | 'height' | 'alt'> {}

function AutoImage({ ...rest }: Props) {
  return (
    <Block>
      <Image {...rest} style={{ objectFit: 'cover' }} fill alt="" />
    </Block>
  );
}

const Block = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export default AutoImage;

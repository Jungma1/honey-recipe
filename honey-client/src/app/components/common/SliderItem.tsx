import styled from '@emotion/styled';
import React from 'react';

interface BlockProps {
  itemWidth: number;
}

interface Props extends BlockProps {
  children: React.ReactNode;
}

function SliderItem({ itemWidth, children }: Props) {
  return <Block itemWidth={itemWidth}>{children}</Block>;
}

const Block = styled.div<BlockProps>`
  width: ${(props) => `${props.itemWidth}px`};
  height: ${(props) => `${props.itemWidth}px`};
  color: white;
  background-color: black;
`;

export default SliderItem;

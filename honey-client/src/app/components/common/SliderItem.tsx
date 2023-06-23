import styled from '@emotion/styled';
import React from 'react';

interface BlockProps {
  itemWidth: number;
}

interface Props extends BlockProps {
  component: React.ReactNode;
}

function SliderItem({ itemWidth, component }: Props) {
  return <Block itemWidth={itemWidth}>{component}</Block>;
}

const Block = styled.div<BlockProps>`
  width: ${(props) => `${props.itemWidth}px`};
  height: ${(props) => `${props.itemWidth}px`};
  color: white;
  background-color: black;
`;

export default SliderItem;

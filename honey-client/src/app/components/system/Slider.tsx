import styled from '@emotion/styled';
import { rem } from 'polished';
import React from 'react';
import { useCarousel } from '~/hooks/useCarousel';
import SliderItem from './SliderItem';

interface BlockProps {
  itemWidth: number;
  itemCount: number;
}

interface Props extends BlockProps {
  children: React.ReactNode;
}

function Slider({ children, itemWidth, itemCount }: Props) {
  const { scrollRef, handleMouseDown, handleMouseUp, handleMouseLeave, handleMouseMove } =
    useCarousel();

  return (
    <Block
      ref={scrollRef}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <StyledSlider itemWidth={itemWidth} itemCount={itemCount}>
        {React.Children.map(children, (child) => (
          <SliderItem itemWidth={itemWidth} component={child} />
        ))}
      </StyledSlider>
    </Block>
  );
}

const Block = styled.section`
  overflow: hidden;
  padding: ${rem(32)};
`;

const StyledSlider = styled.div<BlockProps>`
  width: ${(props) => `calc((${props.itemWidth}px + 16px) * ${props.itemCount} - 16px)`};
  display: flex;
  align-items: center;
  gap: ${rem(16)};
  cursor: pointer;
`;

export default Slider;

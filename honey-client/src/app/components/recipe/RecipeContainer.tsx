import styled from '@emotion/styled';
import { rem } from 'polished';
import React, { useRef, useState } from 'react';

function RecipeContainer() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isClick, setIsClick] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClick(true);
    setStartX(e.pageX);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClick(false);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClick(false);

    if (scrollRef.current) {
      const snapDistance = startX - e.pageX;
      scrollRef.current.scrollLeft += snapDistance;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isClick && scrollRef.current) {
      const snapDistance = startX - e.pageX;
      scrollRef.current.scrollLeft += snapDistance;
      setStartX(e.pageX);
    }
  };

  return (
    <Block
      ref={scrollRef}
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <SliderWrapper>
        <SliderItem>1</SliderItem>
        <SliderItem>2</SliderItem>
        <SliderItem>3</SliderItem>
        <SliderItem>4</SliderItem>
        <SliderItem>5</SliderItem>
        <SliderItem>6</SliderItem>
        <SliderItem>7</SliderItem>
        <SliderItem>8</SliderItem>
        <SliderItem>9</SliderItem>
        <SliderItem>10</SliderItem>
      </SliderWrapper>
    </Block>
  );
}

const Block = styled.section`
  overflow: hidden;
  padding: ${rem(32)};
`;

const SliderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(16)};
  width: calc((320px + 16px) * 10 - 16px);
  cursor: pointer;
`;

const SliderItem = styled.div`
  width: 320px;
  height: 320px;
  color: white;
  background-color: black;
`;

export default RecipeContainer;

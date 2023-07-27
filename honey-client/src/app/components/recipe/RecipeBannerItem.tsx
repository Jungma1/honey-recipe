import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { useState } from 'react';
import { Recipe } from '~/apis/types';
import { colors } from '~/utils/colors';
import AutoImage from '../system/AutoImage';

interface Props {
  recipe: Recipe;
}

function RecipeBannerItem({ recipe }: Props) {
  const router = useRouter();
  const [isMove, setIsMove] = useState(false);
  const [isClick, setIsClick] = useState(false);

  const onClickItem = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMove) {
      router.push(`/recipe/${recipe.id}`);
    }
    setIsMove(false);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClick(true);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClick(false);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isClick) {
      setIsMove(true);
    }
  };

  return (
    <Block
      onClick={onClickItem}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <Wrapper>
        <ProfileWrapper>
          <ImageWrapper>
            <StyledImage src={recipe.user.picture ?? '/test.png'} />
          </ImageWrapper>
          <RightWrapper>
            <Username>{recipe.user.username}</Username>
            <Title>{recipe.title}</Title>
          </RightWrapper>
        </ProfileWrapper>
        <Description>{recipe.description}</Description>
      </Wrapper>
      <StyledImage src={recipe.thumbnail ?? '/test.png'} />
    </Block>
  );
}

const Block = styled.div`
  position: relative;
  user-select: none;
  cursor: pointer;
`;

const Wrapper = styled.div`
  z-index: 10;
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${rem(16)};
  padding: ${rem(16)};
  background: rgba(0, 0, 0, 0.7);
`;

const StyledImage = styled(AutoImage)`
  -webkit-user-drag: none;
`;

const ProfileWrapper = styled.div`
  display: flex;
  gap: ${rem(16)};
  align-items: center;
`;

const ImageWrapper = styled.div`
  width: 48px;

  img {
    border-radius: 50%;
  }
`;

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.div`
  font-size: ${rem(14)};
  color: ${colors.white};
`;

const Title = styled.span`
  color: ${colors.white};
`;

const Description = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${colors.gray1};
`;

export default RecipeBannerItem;

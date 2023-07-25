import styled from '@emotion/styled';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { Recipe } from '~/apis/types';
import { useMotionHorizontal } from '~/hooks/useMotionHorizontal';
import { colors } from '~/utils/colors';
import { formatDate, formatNumber } from '~/utils/format';
import AutoImage from '../system/AutoImage';

interface Props {
  recipe: Recipe;
}

function RecipeItem({ recipe }: Props) {
  const router = useRouter();
  const { x, handleMouseEnter, handleMouseLeave } = useMotionHorizontal(10, false);

  return (
    <Block
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ x }}
      onClick={(e) => router.push(`/recipe/${recipe.id}`)}
    >
      <ImageWrapper>
        <AutoImage src={recipe.thumbnail ?? '/test.png'} />
      </ImageWrapper>
      <ContentWrapper>
        <Title>{recipe.title}</Title>
        <Description>{recipe.description}</Description>
        <EmptyBlock />
        <Footer>
          <AvatarLink href={`/@${recipe.user.handle}`}>
            <Image src={recipe.user.picture || '/test.png'} width={24} height={24} alt="" />
            <span>{recipe.user.username}</span>
          </AvatarLink>
          <StatBlock>
            <CreatedAt>{formatDate(recipe.createdAt)}</CreatedAt>
            <Stat>
              <FavoriteRoundedIcon />
              <span>{formatNumber(recipe.likeCount)}</span>
            </Stat>
            <Stat>
              <ForumRoundedIcon />
              <span>{formatNumber(recipe.commentCount)}</span>
            </Stat>
          </StatBlock>
        </Footer>
      </ContentWrapper>
    </Block>
  );
}

const Block = styled(motion.div)`
  display: flex;
  gap: ${rem(16)};
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
`;

const ContentWrapper = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: ${rem(18)};
  font-weight: 600;
  color: ${colors.gray9};
  margin-bottom: ${rem(8)};
`;

const Description = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-size: ${rem(16)};
  color: ${colors.gray6};
`;

const EmptyBlock = styled.div`
  flex: 1;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AvatarLink = styled(Link)`
  display: flex;
  gap: ${rem(8)};
  align-items: center;
  color: ${colors.gray6};

  img {
    border-radius: 50%;
  }
`;

const StatBlock = styled.div`
  display: flex;
  gap: ${rem(16)};
  color: ${colors.gray6};
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(4)};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CreatedAt = styled.div`
  color: ${colors.gray6};
`;

export default RecipeItem;

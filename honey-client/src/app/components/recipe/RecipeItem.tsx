import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { Recipe } from '~/apis/types';
import { useMotionHorizontal } from '~/hooks/useMotionHorizontal';
import { defaultPictureImage, defaultProfileImage } from '~/static';
import { colors } from '~/utils/colors';
import AutoImage from '../system/AutoImage';
import RecipeStats from './RecipeStats';

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
      onClick={() => router.push(`/recipe/${recipe.id}`)}
    >
      <ImageWrapper>
        <AutoImage src={recipe.thumbnail ?? defaultPictureImage} />
      </ImageWrapper>
      <ContentWrapper>
        <Title>{recipe.title}</Title>
        <Description>{recipe.description}</Description>
        <EmptyBlock />
        <Footer>
          <AvatarLink href={`/@${recipe.user.handle}`} onClick={(e) => e.stopPropagation()}>
            <Image src={recipe.user.picture || defaultProfileImage} width={24} height={24} alt="" />
            <span>{recipe.user.username}</span>
          </AvatarLink>
          <RecipeStats
            createdAt={recipe.createdAt}
            likeCount={recipe.likeCount}
            commentCount={recipe.commentCount}
            isPrivate={recipe.isPrivate}
          />
        </Footer>
      </ContentWrapper>
    </Block>
  );
}

const Block = styled(motion.div)`
  display: flex;
  gap: ${rem(24)};
  cursor: pointer;
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;

  img {
    border-radius: ${rem(8)};
  }
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
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
  font-size: ${rem(16)};
  color: ${colors.gray6};
  margin-bottom: ${rem(16)};
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

export default RecipeItem;

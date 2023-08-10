import styled from '@emotion/styled';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { useState } from 'react';
import { deleteRecipeLike, postRecipeLike } from '~/apis/recipe';
import { useModalStore } from '~/stores/modal';
import { useUserStore } from '~/stores/user';
import { colors } from '~/utils/colors';
import Toggle from '../common/Toggle';

interface Props {
  isLiked: boolean;
  recipeId: number;
}

function RecipeViewerReaction({ isLiked, recipeId }: Props) {
  const router = useRouter();
  const { user } = useUserStore();
  const { openModal } = useModalStore();
  const [isLikedState, setIsLikedState] = useState(isLiked);

  const { mutateAsync: likeRecipe } = useMutation(postRecipeLike, {
    onSuccess: () => {
      setIsLikedState(true);
    },
  });

  const { mutateAsync: unlikeRecipe } = useMutation(deleteRecipeLike, {
    onSuccess: () => {
      setIsLikedState(false);
    },
  });

  const onClickLike = async () => {
    if (!user) {
      openModal({
        title: '로그인이 필요합니다.',
        description: '로그인 페이지로 이동하시겠습니까?',
        onConfirm: () => {
          router.push('/login');
        },
      });
      return;
    }

    if (isLikedState) {
      await unlikeRecipe({
        id: recipeId,
      });
    } else {
      await likeRecipe({
        id: recipeId,
      });
    }
  };

  return (
    <Block>
      <IconBlock
        onClick={onClickLike}
        initial={{ scale: 1 }}
        whileTap={isLikedState ? {} : { scale: 2 }}
      >
        <Toggle
          isValue={isLikedState}
          onComponent={<StyledLikeFillIcon />}
          offComponent={<StyledLikeOutlineIcon />}
        />
      </IconBlock>
      <IconBlock>
        <Toggle
          isValue={false}
          onComponent={<BookmarkRoundedIcon />}
          offComponent={<BookmarkBorderRoundedIcon />}
        />
      </IconBlock>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${rem(8)};
  padding-bottom: ${rem(16)};
`;

const IconBlock = styled(motion.div)`
  display: flex;
  cursor: pointer;
`;

const StyledLikeFillIcon = styled(FavoriteRoundedIcon)`
  color: ${colors.primary};
`;

const StyledLikeOutlineIcon = styled(FavoriteBorderRoundedIcon)`
  color: ${colors.gray5};
`;

export default RecipeViewerReaction;

import styled from '@emotion/styled';
import BookmarkAddedRoundedIcon from '@mui/icons-material/BookmarkAddedRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { useState } from 'react';
import {
  deleteRecipeBookmark,
  deleteRecipeLike,
  postRecipeBookmark,
  postRecipeLike,
} from '~/apis/recipe';
import { useModalStore } from '~/stores/modal';
import { useUserStore } from '~/stores/user';
import { colors } from '~/utils/colors';
import Toggle from '../common/Toggle';

interface Props {
  isLiked: boolean;
  isBookmarked: boolean;
  recipeId: number;
}

function RecipeViewerReaction({ isLiked, isBookmarked, recipeId }: Props) {
  const router = useRouter();
  const { user } = useUserStore();
  const { openModal } = useModalStore();
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [isBookmarkedState, setIsBookmarkedState] = useState(isBookmarked);

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

  const { mutateAsync: bookmarkRecipe } = useMutation(postRecipeBookmark, {
    onSuccess: () => {
      setIsBookmarkedState(true);
    },
  });

  const { mutateAsync: unBookmarkRecipe } = useMutation(deleteRecipeBookmark, {
    onSuccess: () => {
      setIsBookmarkedState(false);
    },
  });

  const handleClickLike = async () => {
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

  const handleClickBookmark = async () => {
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

    if (isBookmarkedState) {
      await unBookmarkRecipe({
        id: recipeId,
      });
    } else {
      await bookmarkRecipe({
        id: recipeId,
      });
    }
  };

  return (
    <Block>
      <IconBlock
        onClick={handleClickLike}
        initial={{ scale: 1 }}
        whileTap={isLikedState ? {} : { scale: 2 }}
      >
        <Toggle
          isValue={isLikedState}
          onComponent={<StyledLikeFillIcon />}
          offComponent={<StyledLikeOutlineIcon />}
        />
      </IconBlock>
      <IconBlock
        onClick={handleClickBookmark}
        initial={{ scale: 1 }}
        whileTap={isBookmarked ? {} : { scale: 2 }}
      >
        <Toggle
          isValue={isBookmarkedState}
          onComponent={<StyledBookmarkFillIcon />}
          offComponent={<StyledBookmarkOutlineIcon />}
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

const StyledBookmarkFillIcon = styled(BookmarkAddedRoundedIcon)`
  color: ${colors.primary};
`;

const StyledBookmarkOutlineIcon = styled(BookmarkBorderRoundedIcon)`
  color: ${colors.gray5};
`;

export default RecipeViewerReaction;

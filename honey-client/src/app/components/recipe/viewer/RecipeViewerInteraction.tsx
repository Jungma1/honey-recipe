import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { deleteRecipe } from '~/apis/recipe';
import { useModalStore } from '~/stores/modal';
import { colors } from '~/utils/colors';

interface Props {
  isOwner: boolean;
  isPrivate: boolean;
  recipeId: number;
}

function RecipeViewerInteraction({ isOwner, isPrivate, recipeId }: Props) {
  const router = useRouter();
  const { openModal } = useModalStore();

  const handleClickEdit = () => {
    router.push(`/recipe/edit?id=${recipeId}`);
  };

  const handleClickDelete = () => {
    openModal({
      title: '레시피 삭제',
      description: '정말 삭제하시겠습니까?',
      onConfirm: async () => {
        await deleteRecipe(recipeId);
        router.push('/');
      },
    });
  };

  if (!isOwner) return <></>;

  return (
    <Block>
      {isPrivate && <Private>비공개</Private>}
      <Text onClick={handleClickEdit}>수정</Text>
      <Text onClick={handleClickDelete}>삭제</Text>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${rem(8)};
  padding-top: ${rem(16)};
`;

const Text = styled.span`
  color: ${colors.gray5};
  cursor: pointer;

  :hover {
    color: ${colors.gray9};
  }
`;

const Private = styled.div`
  padding: ${rem(2)} ${rem(8)};
  border-radius: ${rem(4)};
  font-size: ${rem(14)};
  color: ${colors.white};
  background: ${colors.gray3};
`;

export default RecipeViewerInteraction;

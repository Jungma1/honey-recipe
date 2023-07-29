import styled from '@emotion/styled';
import { RecipeRead } from '~/apis/types';
import { useUserStore } from '~/stores/user';
import RecipeCourseList from './RecipeCourseList';
import RecipeViewerHeader from './RecipeViewerHeader';
import RecipeViewerInteraction from './RecipeViewerInteraction';

interface Props {
  recipe: RecipeRead;
}

function RecipeViewer({ recipe }: Props) {
  const { user } = useUserStore();
  const isOwner = recipe.user.id === user?.id;

  return (
    <Block>
      <RecipeViewerHeader recipe={recipe} />
      <RecipeViewerInteraction isOwner={isOwner} recipeId={recipe.id} />
      <RecipeCourseList course={recipe.course} />
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

export default RecipeViewer;

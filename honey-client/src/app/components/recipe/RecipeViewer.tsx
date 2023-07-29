import styled from '@emotion/styled';
import { RecipeRead } from '~/apis/types';
import RecipeCourseList from './RecipeCourseList';
import RecipeViewerHeader from './RecipeViewerHeader';

interface Props {
  recipe: RecipeRead;
}

function RecipeViewer({ recipe }: Props) {
  return (
    <Block>
      <RecipeViewerHeader recipe={recipe} />
      <RecipeCourseList course={recipe.course} />
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

export default RecipeViewer;

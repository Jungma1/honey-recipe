import styled from '@emotion/styled';
import { RecipeRead } from '~/apis/types';
import RecipeViewerHeader from './RecipeViewerHeader';

interface Props {
  recipe: RecipeRead;
}

function RecipeViewer({ recipe }: Props) {
  return (
    <Section>
      <RecipeViewerHeader recipe={recipe} />
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

export default RecipeViewer;

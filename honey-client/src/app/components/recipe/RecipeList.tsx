import styled from '@emotion/styled';
import { rem } from 'polished';
import { Recipe } from '~/apis/types';
import RecipeItem from './RecipeItem';

interface Props {
  recipes: Recipe[];
}

function RecipeList({ recipes }: Props) {
  return (
    <Block>
      {recipes.map((recipe) => (
        <RecipeItem key={recipe.id} recipe={recipe} />
      ))}
    </Block>
  );
}

const Block = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${rem(48)};
`;

export default RecipeList;

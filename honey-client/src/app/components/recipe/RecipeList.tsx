import styled from '@emotion/styled';
import { rem } from 'polished';
import { Recipe } from '~/apis/types';
import RecipeItem from './RecipeItem';
import RecipeListTab from './RecipeListTab';

interface Props {
  recipes: Recipe[];
}

function RecipeList({ recipes }: Props) {
  return (
    <Block>
      <RecipeListTab />
      <Content>
        {recipes.map((recipe) => (
          <RecipeItem key={recipe.id} recipe={recipe} />
        ))}
      </Content>
    </Block>
  );
}

const Block = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(48)};
`;

export default RecipeList;

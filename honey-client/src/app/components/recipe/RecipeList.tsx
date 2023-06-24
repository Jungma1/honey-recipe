import styled from '@emotion/styled';
import { rem } from 'polished';
import RecipeItem from './RecipeItem';
import RecipeListTab from './RecipeListTab';

function RecipeList() {
  return (
    <Block>
      <RecipeListTab />
      <Content>
        {Array.from({ length: 10 }, (_, i) => (
          <RecipeItem key={i} />
        ))}
      </Content>
    </Block>
  );
}

const Block = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${rem(16)};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(16)};
`;

export default RecipeList;

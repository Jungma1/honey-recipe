import styled from '@emotion/styled';
import { rem } from 'polished';
import { Recipe } from '~/apis/types';
import TitleGroup from '../common/TitleGroup';
import Slider from '../system/Slider';
import RecipeBannerItem from './RecipeBannerItem';

interface Props {
  recipes: Recipe[];
}

function RecipeBannerList({ recipes }: Props) {
  return (
    <Block>
      <TitleGroup title="실시간 베스트">
        <Slider itemWidth={300} itemCount={recipes.length}>
          {recipes.map((recipe) => (
            <RecipeBannerItem key={recipe.id} recipe={recipe} />
          ))}
        </Slider>
      </TitleGroup>
    </Block>
  );
}

const Block = styled.section`
  margin-bottom: ${rem(64)};
`;

export default RecipeBannerList;

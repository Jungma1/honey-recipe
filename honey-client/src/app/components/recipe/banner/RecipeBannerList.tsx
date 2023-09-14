import styled from '@emotion/styled';
import { rem } from 'polished';
import { Recipe } from '~/apis/types';
import Slider from '~/components/common/Slider';
import SliderItem from '~/components/common/SliderItem';
import TitleGroup from '~/components/common/TitleGroup';
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
            <SliderItem itemWidth={300} key={recipe.id}>
              <RecipeBannerItem recipe={recipe} />
            </SliderItem>
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

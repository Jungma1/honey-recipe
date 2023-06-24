import styled from '@emotion/styled';
import { rem } from 'polished';
import Slider from '../system/Slider';

function RecipeBanner() {
  return (
    <Block>
      <Slider itemWidth={300} itemCount={5}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i}>{i}</div>
        ))}
      </Slider>
    </Block>
  );
}

const Block = styled.section`
  margin-bottom: ${rem(64)};
`;

export default RecipeBanner;

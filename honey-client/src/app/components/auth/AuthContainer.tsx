import styled from '@emotion/styled';
import { rem } from 'polished';
import { colors } from '~/utils/colors';
import { AuthIcon } from '../vector';
import AuthButtonGroup from './AuthButtonGroup';

function AuthContainer() {
  return (
    <Block>
      <Wrapper>
        <AuthIcon width={400} />
        <AuthButtonGroup />
      </Wrapper>
    </Block>
  );
}

const Block = styled.section`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.secondaryDark};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${rem(64)};
`;

export default AuthContainer;

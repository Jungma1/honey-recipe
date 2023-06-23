import styled from '@emotion/styled';
import { rem } from 'polished';
import AuthButton from './AuthButton';

function AuthButtonGroup() {
  return (
    <Block>
      <AuthButton provider="google" />
      <AuthButton provider="naver" />
      <AuthButton provider="kakao" />
    </Block>
  );
}

const Block = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${rem(16)};
`;

export default AuthButtonGroup;

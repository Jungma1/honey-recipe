import styled from '@emotion/styled';
import { useRootStore } from '~/stores';
import { colors } from '~/utils/colors';
import Button from '../system/Button';

function Header() {
  const { user } = useRootStore();

  return (
    <StyledHeader>
      <StyledLogo>KKULPI</StyledLogo>
      {user ? <Button>레시피 쓰기</Button> : <Button>로그인</Button>}
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledLogo = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.gray9};
`;

export default Header;

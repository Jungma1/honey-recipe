import styled from '@emotion/styled';
import { colors } from '~/utils/colors';

function Header() {
  return (
    <StyledHeader>
      <StyledLogo>KKULPI</StyledLogo>
      <div>메뉴</div>
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

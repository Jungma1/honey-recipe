import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { useRootStore } from '~/stores';
import { colors } from '~/utils/colors';
import Button from '../system/Button';

function Header() {
  const { user } = useRootStore();
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRecipeWrite = () => {
    router.push('/recipe/write');
  };

  return (
    <StyledHeader>
      <StyledLogo>KKULPI</StyledLogo>
      {user ? (
        <Button onClick={handleRecipeWrite}>레시피 작성</Button>
      ) : (
        <Button onClick={handleLogin}>로그인</Button>
      )}
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const StyledLogo = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.gray9};
`;

export default Header;

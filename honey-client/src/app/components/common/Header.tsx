import styled from '@emotion/styled';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { rem } from 'polished';
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
        <Wrapper>
          <Button onClick={handleRecipeWrite}>레시피 작성</Button>
          <Image src={user.picture} width={32} height={32} alt="" />
        </Wrapper>
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
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 4px;
  cursor: pointer;
`;

const StyledLogo = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.gray9};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(16)};

  img {
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;
  }
`;

export default Header;

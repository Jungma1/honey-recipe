import styled from '@emotion/styled';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { useEffect, useState } from 'react';
import { useUserState } from '~/stores/user';
import { colors } from '~/utils/colors';
import Button from '../system/Button';

function Header() {
  const [isClient, setIsClient] = useState(false);
  const { user } = useUserState();
  const router = useRouter();

  const handleClickLogo = () => {
    router.push('/');
  };

  const handleClickLogin = () => {
    router.push('/login');
  };

  const handleClickRecipeWrite = () => {
    router.push('/recipe/write');
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <></>;

  return (
    <StyledHeader>
      <StyledLogo onClick={handleClickLogo}>KKULPI</StyledLogo>
      {user ? (
        <Wrapper>
          <Button onClick={handleClickRecipeWrite}>레시피 작성</Button>
          <Image src={user.picture} width={32} height={32} alt="" />
        </Wrapper>
      ) : (
        <Button onClick={handleClickLogin}>로그인</Button>
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

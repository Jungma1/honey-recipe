import styled from '@emotion/styled';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { useState } from 'react';
import { defaultProfileImage } from '~/static';
import { useUserStore } from '~/stores/user';
import { colors } from '~/utils/colors';
import Button from '../system/Button';
import HeaderMenu from './HeaderMenu';

function Header() {
  const router = useRouter();
  const { user } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onClickLogo = () => {
    router.push('/');
  };

  const onClickLogin = () => {
    router.push('/login');
  };

  const onClickRecipeWrite = () => {
    router.push('/recipe/write');
  };

  const onClickOpenMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <StyledHeader>
      <StyledLogo onClick={onClickLogo}>KKULPI</StyledLogo>
      {user ? (
        <Wrapper>
          <Button onClick={onClickRecipeWrite}>레시피 작성</Button>
          <Image
            src={user.picture ?? defaultProfileImage}
            width={32}
            height={32}
            alt=""
            onClick={onClickOpenMenu}
          />
          <HeaderMenu isOpen={isMenuOpen} />
        </Wrapper>
      ) : (
        <Button onClick={onClickLogin}>로그인</Button>
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
`;

const StyledLogo = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${colors.gray9};
  cursor: pointer;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  img {
    cursor: pointer;
    margin-left: ${rem(16)};
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 8px;
  }
`;

export default Header;

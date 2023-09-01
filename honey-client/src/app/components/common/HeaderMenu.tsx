import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { postLogout } from '~/apis/user';
import { useUserStore } from '~/stores/user';
import { colors } from '~/utils/colors';

interface Props {
  isOpen: boolean;
}

function HeaderMenu({ isOpen }: Props) {
  const router = useRouter();
  const { user } = useUserStore();

  const handleClickLogout = async () => {
    try {
      await postLogout();
      router.push('/');
    } catch (e) {}
  };

  if (!isOpen) return <></>;

  return (
    <Block>
      <MenuItem onClick={() => router.push(`/@${user?.handle}`)}>내 레시피</MenuItem>
      <MenuItem onClick={() => router.push('/setting')}>설정</MenuItem>
      <MenuItem onClick={handleClickLogout}>로그아웃</MenuItem>
    </Block>
  );
}

const Block = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: ${rem(16)};
  background: ${colors.white};
  z-index: 20;
  border-radius: ${rem(4)};
  box-shadow: 2px 8px 4px 4px rgba(0, 0, 0, 0.1);
`;

const MenuItem = styled.div`
  cursor: pointer;
  padding: ${rem(16)} ${rem(16)};

  :hover {
    font-weight: 700;
    color: ${colors.primary};
  }
`;

export default HeaderMenu;

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { useMemo } from 'react';
import { colors } from '~/utils/colors';

interface Props {
  mode: string;
}

function RecipeListTab({ mode }: Props) {
  const router = useRouter();
  const menus = useMemo(
    () => [
      {
        name: '최신',
        mode: 'recent',
      },
      {
        name: '일간',
        mode: 'daily',
      },
      {
        name: '주간',
        mode: 'weekly',
      },
      {
        name: '월간',
        mode: 'monthly',
      },
    ],
    []
  );

  const handleClickTab = (e: React.MouseEvent<HTMLLIElement>, mode: string) => {
    router.push(`/?mode=${mode}`);
  };

  return (
    <Block>
      <StyledUl>
        {menus.map((menu) => (
          <StyledLi
            key={menu.name}
            isActive={menu.mode === mode}
            onClick={(e) => handleClickTab(e, menu.mode)}
          >
            {menu.name}
          </StyledLi>
        ))}
      </StyledUl>
    </Block>
  );
}

const Block = styled.nav`
  border-bottom: ${rem(2)} solid ${colors.primary};
  margin-bottom: ${rem(32)};
`;

const StyledUl = styled.ul`
  display: flex;
  align-items: center;
  text-align: center;
`;

const StyledLi = styled.li<{ isActive: boolean }>`
  flex: 1;
  color: ${colors.gray9};
  padding: ${rem(8)} 0;
  font-size: ${rem(18)};
  font-weight: 600;
  cursor: pointer;

  ${({ isActive }) =>
    isActive &&
    css`
      color: ${colors.primary};
      margin-bottom: ${rem(-2)};
      border: ${rem(2)} solid ${colors.primary};
      border-bottom: ${rem(2)} solid ${colors.white};
    `}
`;

export default RecipeListTab;

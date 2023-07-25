import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { rem } from 'polished';
import { colors } from '~/utils/colors';

function RecipeListTab() {
  return (
    <Block>
      <StyledUl>
        <StyledLi active>최신</StyledLi>
        <StyledLi>일간</StyledLi>
        <StyledLi>주간</StyledLi>
        <StyledLi>월간</StyledLi>
        <StyledLi>연간</StyledLi>
      </StyledUl>
    </Block>
  );
}

const Block = styled.nav`
  border-bottom: ${rem(2)} solid ${colors.primary};
`;

const StyledUl = styled.ul`
  display: flex;
  align-items: center;
  text-align: center;
`;

const StyledLi = styled.li<{ active?: boolean }>`
  flex: 1;
  color: ${colors.gray9};
  padding: ${rem(8)} 0;
  font-size: ${rem(18)};
  font-weight: 600;
  cursor: pointer;

  ${({ active }) =>
    active &&
    css`
      color: ${colors.primary};
      margin-bottom: ${rem(-2)};
      border: ${rem(2)} solid ${colors.primary};
      border-bottom: ${rem(2)} solid ${colors.white};
    `}
`;

export default RecipeListTab;

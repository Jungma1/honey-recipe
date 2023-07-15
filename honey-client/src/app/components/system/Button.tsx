import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { rem } from 'polished';
import React from 'react';
import { colors } from '~/utils/colors';

interface StyledButtonProps {
  danger?: boolean;
  outlined?: boolean;
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, StyledButtonProps {
  children: React.ReactNode;
}

function Button({ children, ...props }: Props) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

const StyledButton = styled.button<StyledButtonProps>`
  cursor: pointer;
  font-size: ${rem(14)};
  font-weight: bold;
  padding: ${rem(8)} ${rem(8)};
  border-radius: 5px;
  color: ${colors.white};
  background-color: ${colors.primary};

  :hover {
    background-color: ${colors.primaryDark};
  }

  ${(props) =>
    props.danger &&
    css`
      background-color: ${colors.danger};
    `}

  ${(props) =>
    props.outlined &&
    css`
      color: ${colors.primary};
      background-color: ${colors.white};
      border: 1px solid ${colors.primary};

      :hover {
        background-color: ${colors.white};
      }
    `}
`;

export default Button;

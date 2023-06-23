import styled from '@emotion/styled';
import { rem } from 'polished';
import React from 'react';
import { colors } from '~/utils/colors';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function Button({ children, ...props }: Props) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

const StyledButton = styled.button`
  font-size: ${rem(14)};
  font-weight: bold;
  padding: ${rem(8)} ${rem(8)};
  border-radius: 5px;
  color: ${colors.white};
  background-color: ${colors.primary};
  cursor: pointer;
`;

export default Button;

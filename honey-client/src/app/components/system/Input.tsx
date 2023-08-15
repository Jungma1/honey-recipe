import styled from '@emotion/styled';
import { rem } from 'polished';
import { forwardRef } from 'react';
import { colors } from '~/utils/colors';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef(function Input({ ...rest }: Props, ref: React.Ref<HTMLInputElement>) {
  return <StyledInput {...rest} ref={ref} />;
});

const StyledInput = styled.input`
  padding: ${rem(8)} ${rem(12)};
  border-radius: ${rem(4)};
  border: 1px solid ${colors.gray2};
  font-size: ${rem(16)};
  color: ${colors.gray9};
  outline: none;

  :focus {
    border-color: ${colors.primary};
  }
`;

export default Input;

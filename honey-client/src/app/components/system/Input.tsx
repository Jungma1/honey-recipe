import styled from '@emotion/styled';
import { rem } from 'polished';
import { colors } from '~/utils/colors';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ ...rest }: Props) {
  return <StyledInput {...rest} />;
}

const StyledInput = styled.input`
  padding: ${rem(8)} ${rem(12)};
  border-radius: ${rem(4)};
  border: 1px solid ${colors.gray2};
  font-size: ${rem(16)};
  color: ${colors.gray9};
  outline: none;
`;

export default Input;

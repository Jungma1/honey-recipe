import styled from '@emotion/styled';
import { rem } from 'polished';

interface Props {
  children: React.ReactNode;
}

function RecipeCourseForm({ children }: Props) {
  return <Form>{children}</Form>;
}

const Form = styled.form`
  margin-top: ${rem(64)};
`;

export default RecipeCourseForm;

import styled from '@emotion/styled';
import { rem } from 'polished';
import Button from '../system/Button';
import RecipeErrorMessage from './RecipeErrorMessage';

interface Props {
  buttonText: string;
  errorMessage: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

function RecipeForm({ buttonText, errorMessage, onSubmit, children }: Props) {
  return (
    <Form onSubmit={onSubmit}>
      <Content>{children}</Content>
      <RecipeErrorMessage message={errorMessage} />
      <SubmitButton>{buttonText}</SubmitButton>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${rem(32)};
`;

const SubmitButton = styled(Button)`
  height: ${rem(48)};
  font-size: ${rem(18)};
`;

export default RecipeForm;

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
    <Section>
      <Form onSubmit={onSubmit}>
        {children}
        <RecipeErrorMessage message={errorMessage} />
        <SubmitButton>{buttonText}</SubmitButton>
      </Form>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${rem(64)};
`;

const SubmitButton = styled(Button)`
  height: ${rem(48)};
  font-size: ${rem(18)};
`;

export default RecipeForm;

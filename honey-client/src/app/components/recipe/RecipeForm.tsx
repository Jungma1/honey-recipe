import styled from '@emotion/styled';
import { rem } from 'polished';
import Button from '../system/Button';

interface Props {
  buttonText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

function RecipeForm({ buttonText, onSubmit, children }: Props) {
  return (
    <Section>
      <Form onSubmit={onSubmit}>
        {children}
        <SubmitButton size="large">{buttonText}</SubmitButton>
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
`;

export default RecipeForm;

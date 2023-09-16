import styled from '@emotion/styled';
import { rem } from 'polished';
import Button from '../system/Button';

interface Props {
  children: React.ReactNode;
  buttonText: string;
  onClickButton(): void;
}

function RecipeTemplate({ buttonText, onClickButton, children }: Props) {
  return (
    <Section>
      <Wrapper>
        {children}
        <SubmitButton size="large" onClick={onClickButton}>
          {buttonText}
        </SubmitButton>
      </Wrapper>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(64)};
`;

const SubmitButton = styled(Button)`
  height: ${rem(48)};
`;

export default RecipeTemplate;

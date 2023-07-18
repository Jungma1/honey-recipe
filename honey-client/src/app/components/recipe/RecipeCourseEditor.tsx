import styled from '@emotion/styled';
import RecipeCourseAddButton from './RecipeCourseAddButton';

function RecipeCourseEditor() {
  return (
    <Section>
      <RecipeCourseAddButton />
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

export default RecipeCourseEditor;

import styled from '@emotion/styled';
import { RecipeComment } from '~/apis/types';
import RecipeCommentEditor from './RecipeCommentEditor';

interface Props {
  comments: RecipeComment[];
}

function RecipeCommentList({ comments }: Props) {
  return (
    <Section>
      <RecipeCommentEditor />
      <div>
        {comments.map((comment) => (
          <div key={comment.id}>{comment.content}</div>
        ))}
      </div>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
`;

export default RecipeCommentList;

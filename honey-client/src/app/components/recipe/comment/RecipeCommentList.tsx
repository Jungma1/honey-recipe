import styled from '@emotion/styled';
import { rem } from 'polished';
import { RecipeComment } from '~/apis/types';
import RecipeCommentEditor from './RecipeCommentEditor';
import RecipeCommentItem from './RecipeCommentItem';

interface Props {
  comments: RecipeComment[];
}

function RecipeCommentList({ comments }: Props) {
  return (
    <Section>
      <RecipeCommentEditor />
      <Block>
        {comments.map((comment) => (
          <RecipeCommentItem key={comment.id} comment={comment} />
        ))}
      </Block>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(24)};
`;

export default RecipeCommentList;

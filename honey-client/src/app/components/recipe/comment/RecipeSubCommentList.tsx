import styled from '@emotion/styled';
import { rem } from 'polished';
import { RecipeComment } from '~/apis/types';
import RecipeCommentItem from './RecipeCommentItem';

interface Props {
  subComments: RecipeComment[];
}

function RecipeSubCommentList({ subComments }: Props) {
  return (
    <Block>
      {subComments.map((subComment) => (
        <RecipeCommentItem key={subComment.id} comment={subComment} isSubComment />
      ))}
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(16)};
`;

export default RecipeSubCommentList;

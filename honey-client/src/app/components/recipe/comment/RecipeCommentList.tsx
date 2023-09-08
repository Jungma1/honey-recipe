import styled from '@emotion/styled';
import { rem } from 'polished';
import { RecipeComment } from '~/apis/types';
import { useUserStore } from '~/stores/user';
import { colors } from '~/utils/colors';
import RecipeCommentEditor from './RecipeCommentEditor';
import RecipeCommentItem from './RecipeCommentItem';

interface Props {
  comments: RecipeComment[];
  commentCount: number;
}

function RecipeCommentList({ comments, commentCount }: Props) {
  const { user } = useUserStore();

  return (
    <Block>
      <CommentCount>댓글 {commentCount.toLocaleString()}개</CommentCount>
      {user && <RecipeCommentEditor />}
      <Wrapper>
        {comments.map((comment) => (
          <RecipeCommentItem key={comment.id} comment={comment} />
        ))}
      </Wrapper>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: ${rem(16)};
  border-top: 1px solid ${colors.gray0};
`;

const CommentCount = styled.div`
  margin-bottom: ${rem(16)};
  color: ${colors.gray9};
  font-weight: 600;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${rem(32)};
  gap: ${rem(24)};
`;

export default RecipeCommentList;

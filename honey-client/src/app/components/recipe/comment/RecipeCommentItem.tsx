import styled from '@emotion/styled';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { useState } from 'react';
import { getRecipeSubComments } from '~/apis/recipe';
import { RecipeComment } from '~/apis/types';
import Toggle from '~/components/common/Toggle';
import AutoImage from '~/components/system/AutoImage';
import { colors } from '~/utils/colors';
import { formatDate, formatNumber } from '~/utils/format';
import RecipeCommentEditor from './RecipeCommentEditor';
import RecipeSubCommentList from './RecipeSubCommentList';

interface Props {
  comment: RecipeComment;
  isSubComment?: boolean;
}

function RecipeCommentItem({ comment, isSubComment }: Props) {
  const router = useRouter();
  const [rootCommentId, setRootCommentId] = useState(comment.id);
  const [currentCommentId, setCurrentCommentId] = useState<number>();
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isSubCommentOpen, setIsSubCommentOpen] = useState(false);
  const [isSubCommentLoaded, setIsSubCommentLoaded] = useState(false);
  const id = parseInt(router.query.id as string);

  const { data: subComments } = useQuery(
    ['comment', comment.id],
    () => getRecipeSubComments(id, comment.id),
    {
      enabled: isSubCommentLoaded,
    }
  );

  const onClickReply = () => {
    setIsReplyOpen(!isReplyOpen);
    setCurrentCommentId(comment.id);

    if (comment.parentCommentId) {
      setRootCommentId(comment.parentCommentId);
    }
  };

  const onClickCloseReply = () => {
    setIsReplyOpen(false);
  };

  return (
    <Block>
      <Avatar>
        <AutoImage src={comment.user.picture ?? '/profile.png'} />
      </Avatar>
      <Info>
        <Username>{comment.user.username}</Username>
        <Content>{comment.content}</Content>
        <Wrapper>
          <CreatedAt>{formatDate(comment.createdAt)}</CreatedAt>
          <Reply onClick={onClickReply}>답글쓰기</Reply>
        </Wrapper>
        {isReplyOpen && (
          <RecipeCommentEditor
            onClose={onClickCloseReply}
            rootCommentId={rootCommentId}
            targetCommentId={currentCommentId}
            isButtonVisible
          />
        )}
        {!isSubComment && comment.replyCount !== 0 && (
          <ReplyBlock>
            <ReplyToggle
              onClick={() => {
                setIsSubCommentLoaded(true);
                setIsSubCommentOpen(!isSubCommentOpen);
              }}
            >
              <span>{formatNumber(comment.replyCount)}개의 답글</span>
              <Toggle
                isValue={isSubCommentOpen}
                onComponent={<KeyboardArrowDownRoundedIcon />}
                offComponent={<KeyboardArrowUpRoundedIcon />}
              />
            </ReplyToggle>
          </ReplyBlock>
        )}
        {isSubCommentOpen && subComments && <RecipeSubCommentList subComments={subComments} />}
      </Info>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  gap: ${rem(16)};
`;

const Avatar = styled.div`
  flex: none;
  width: ${rem(40)};

  img {
    border-radius: 50%;
  }
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  color: ${colors.gray9};
  font-size: ${rem(16)};
  font-weight: 500;
  margin-bottom: ${rem(4)};
`;

const Content = styled.div`
  color: ${colors.gray9};
  font-size: ${rem(16)};
  white-space: pre-line;
  margin-bottom: ${rem(8)};
`;

const Wrapper = styled.div`
  display: flex;
  gap: ${rem(8)};
  margin-bottom: ${rem(8)};
`;

const CreatedAt = styled.span`
  color: ${colors.gray9};
  font-size: ${rem(14)};
`;

const Reply = styled.div`
  color: ${colors.gray9};
  font-size: ${rem(14)};
  cursor: pointer;
`;

const ReplyBlock = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.primaryDark};
  font-weight: 600;
`;

const ReplyToggle = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export default RecipeCommentItem;

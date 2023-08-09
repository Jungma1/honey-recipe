import styled from '@emotion/styled';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { useEffect, useState } from 'react';
import { deleteRecipeComment, getRecipeSubComments } from '~/apis/recipe';
import { RecipeComment } from '~/apis/types';
import Toggle from '~/components/common/Toggle';
import AutoImage from '~/components/system/AutoImage';
import { useModalStore } from '~/stores/modal';
import { useUserStore } from '~/stores/user';
import { colors } from '~/utils/colors';
import { formatDate, formatNumber } from '~/utils/format';
import RecipeSubCommentEditor from './RecipeSubCommentEditor';
import RecipeSubCommentList from './RecipeSubCommentList';

interface Props {
  comment: RecipeComment;
  isSubComment?: boolean;
}

function RecipeCommentItem({ comment, isSubComment }: Props) {
  const router = useRouter();
  const { user } = useUserStore();
  const { openModal } = useModalStore();
  const [replyCount, setReplyCount] = useState(comment.replyCount);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isSubCommentOpen, setIsSubCommentOpen] = useState(false);
  const [isSubCommentLoaded, setIsSubCommentLoaded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const id = parseInt(router.query.id as string);
  const isOwner = comment.user.id === user?.id;
  const parentCommentId = comment.parentCommentId ?? comment.id;
  const queryClient = useQueryClient();

  const { data: subComments } = useQuery(
    ['comment', comment.id],
    () => getRecipeSubComments(id, comment.id),
    {
      enabled: isSubCommentLoaded,
    }
  );

  const { mutateAsync: deleteComment } = useMutation(deleteRecipeComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', id]);

      if (comment.id === parentCommentId) {
        queryClient.invalidateQueries(['comments', id]);
      } else {
        queryClient.invalidateQueries(['comment', parentCommentId]);
      }
    },
  });

  const onClickDelete = () => {
    openModal({
      title: '댓글 삭제',
      description: '정말 삭제하시겠습니까?',
      onConfirm: async () => {
        await deleteComment({
          id,
          commentId: comment.id,
        });
      },
    });
  };

  useEffect(() => {
    if (subComments) {
      setReplyCount(subComments.length);
    }
  }, [subComments]);

  return (
    <Block>
      <Avatar>
        <AutoImage src={comment.user.picture ?? '/profile.png'} />
      </Avatar>
      <Info>
        <Username>{comment.user.username}</Username>
        {!isEditMode ? (
          <Content>
            {comment.mentionUser && (
              <MentionLink href={`/@${comment.mentionUser.handle}`}>
                {comment.mentionUser.username}
              </MentionLink>
            )}
            <span>{comment.content}</span>
          </Content>
        ) : (
          <RecipeSubCommentEditor
            defaultContent={comment.content}
            parentCommentId={parentCommentId}
            targetCommentId={comment.id}
            onClose={() => setIsEditMode(false)}
            isEdit
          />
        )}
        <Wrapper>
          <CreatedAt>{formatDate(comment.createdAt)}</CreatedAt>
          <Reply onClick={() => setIsReplyOpen(!isReplyOpen)}>답글쓰기</Reply>
        </Wrapper>
        {isReplyOpen && (
          <RecipeSubCommentEditor
            parentCommentId={parentCommentId}
            targetCommentId={comment.id}
            onLoaded={() => {
              setIsSubCommentLoaded(true);
              setIsSubCommentOpen(true);
            }}
            onClose={() => setIsReplyOpen(false)}
          />
        )}
        {!isSubComment && replyCount !== 0 && (
          <ReplyBlock>
            <ReplyToggle
              onClick={() => {
                setIsSubCommentLoaded(true);
                setIsSubCommentOpen(!isSubCommentOpen);
              }}
            >
              <span>{formatNumber(replyCount)}개의 답글</span>
              <Toggle
                isValue={isSubCommentOpen}
                onComponent={<KeyboardArrowDownRoundedIcon />}
                offComponent={<KeyboardArrowUpRoundedIcon />}
              />
            </ReplyToggle>
          </ReplyBlock>
        )}
        {isSubCommentOpen && replyCount !== 0 && subComments && (
          <RecipeSubCommentList subComments={subComments} />
        )}
      </Info>
      {isOwner && (
        <Interaction>
          <span onClick={() => setIsEditMode(true)}>수정</span>
          <span onClick={onClickDelete}>삭제</span>
        </Interaction>
      )}
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  gap: ${rem(16)};
  position: relative;
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
`;

const MentionLink = styled(Link)`
  color: ${colors.primaryDark};
  font-weight: bold;
  margin-right: ${rem(4)};
`;

const Wrapper = styled.div`
  display: flex;
  gap: ${rem(8)};
  margin-top: ${rem(8)};
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

const Interaction = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  gap: ${rem(8)};
  user-select: none;
  font-size: ${rem(14)};
  color: ${colors.gray6};

  span {
    cursor: pointer;
  }
`;

export default RecipeCommentItem;

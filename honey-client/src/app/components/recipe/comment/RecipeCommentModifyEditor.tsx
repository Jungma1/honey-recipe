import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { patchRecipeComment } from '~/apis/recipe';
import CommentEditor from '~/components/common/CommentEditor';

interface Props {
  defaultContent: string;
  rootCommentId: number | null;
  targetCommentId: number;
  onClose: () => void;
}

function RecipeCommentModifyEditor({
  defaultContent,
  rootCommentId,
  targetCommentId,
  onClose,
}: Props) {
  const router = useRouter();
  const [content, setContent] = useState(defaultContent);
  const id = parseInt(router?.query.id as string);
  const queryClient = useQueryClient();

  const { mutateAsync: updateComment } = useMutation(patchRecipeComment, {
    onSuccess: () => {
      if (rootCommentId) {
        queryClient.invalidateQueries(['comment', rootCommentId]);
      } else {
        queryClient.invalidateQueries(['comments', id]);
      }
    },
  });

  const onChangeContent = (value: string) => {
    setContent(value);
  };

  const onSubmitComment = async () => {
    await updateComment({
      id,
      commentId: targetCommentId,
      content,
    });
  };

  return (
    <CommentEditor
      defaultValue={content}
      onChangeValue={onChangeContent}
      onConfirm={onSubmitComment}
      onClose={onClose}
      defaultButtonVisible
    />
  );
}

export default RecipeCommentModifyEditor;

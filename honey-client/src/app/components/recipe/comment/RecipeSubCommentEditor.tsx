import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { patchRecipeComment, postRecipeComment } from '~/apis/recipe';
import CommentEditor from '~/components/common/CommentEditor';
import { queryKeys } from '~/constants/queryKeys';

interface Props {
  parentCommentId: number;
  targetCommentId: number;
  defaultContent?: string;
  isEdit?: boolean;
  onClose: () => void;
  onLoaded?: () => void;
}

function RecipeSubCommentEditor({
  parentCommentId,
  targetCommentId,
  defaultContent,
  isEdit,
  onClose,
  onLoaded,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    content: defaultContent ?? '',
    targetCommentId,
  });
  const id = parseInt(router?.query.id as string);
  const queryClient = useQueryClient();

  const { mutateAsync: createComment } = useMutation(postRecipeComment, {
    onSuccess: () => {
      onLoaded?.();
      queryClient.invalidateQueries([queryKeys.recipe, id]);
      queryClient.invalidateQueries([queryKeys.comment, parentCommentId]);
    },
  });

  const { mutateAsync: updateComment } = useMutation(patchRecipeComment, {
    onSuccess: () => {
      if (targetCommentId === parentCommentId) {
        queryClient.invalidateQueries([queryKeys.comments, id]);
      } else {
        queryClient.invalidateQueries([queryKeys.comment, parentCommentId]);
      }
    },
  });

  const handleChangeContent = (value: string) => {
    setForm({
      ...form,
      content: value,
    });
  };

  const handleSubmitComment = async () => {
    if (!isEdit) {
      await createComment({
        id,
        request: {
          content: form.content,
          targetCommentId: form.targetCommentId,
        },
      });
    } else {
      await updateComment({
        id,
        commentId: targetCommentId,
        content: form.content,
      });
    }
  };

  return (
    <CommentEditor
      defaultValue={form.content}
      onChange={handleChangeContent}
      onConfirm={handleSubmitComment}
      onClose={onClose}
      defaultButtonVisible={true}
    />
  );
}

export default RecipeSubCommentEditor;

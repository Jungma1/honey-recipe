import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { postRecipeComment } from '~/apis/recipe';
import { RecipeCommentCreateRequest } from '~/apis/types';
import CommentEditor from '~/components/common/CommentEditor';

interface Props {
  rootCommentId?: number;
  targetCommentId?: number;
  isButtonVisible?: boolean;
  onClose?: () => void;
}

function RecipeCommentEditor({ isButtonVisible, rootCommentId, targetCommentId, onClose }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    content: '',
    targetCommentId: targetCommentId ?? null,
  });
  const queryClient = useQueryClient();
  const id = parseInt(router?.query.id as string);

  const postCommentMutation = useMutation(
    (request: RecipeCommentCreateRequest) => postRecipeComment(id, request),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', id]);

        if (rootCommentId) {
          queryClient.invalidateQueries(['comment', rootCommentId]);
        }
      },
    }
  );

  const onChangeText = (value: string) => {
    setForm({
      ...form,
      content: value,
    });
  };

  const onSubmitComment = async () => {
    await postCommentMutation.mutateAsync(form);
  };

  return (
    <CommentEditor
      onChangeValue={onChangeText}
      onConfirm={onSubmitComment}
      defaultButtonVisible={isButtonVisible}
      onClose={onClose}
    />
  );
}

export default RecipeCommentEditor;

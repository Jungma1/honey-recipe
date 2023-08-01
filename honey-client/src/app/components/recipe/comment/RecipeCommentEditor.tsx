import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { postRecipeComment } from '~/apis/recipe';
import { RecipeCommentCreateRequest } from '~/apis/types';
import CommentEditor from '~/components/common/CommentEditor';

interface Props {
  parentCommentId?: number;
}

function RecipeCommentEditor({ parentCommentId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    content: '',
    parentCommentId: parentCommentId ?? null,
  });
  const queryClient = useQueryClient();
  const id = parseInt(router?.query.id as string);

  const postCommentMutation = useMutation(
    (request: RecipeCommentCreateRequest) => postRecipeComment(id, request),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', id]);
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

  return <CommentEditor onChangeValue={onChangeText} onSubmit={onSubmitComment} />;
}

export default RecipeCommentEditor;

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { postRecipeComment } from '~/apis/recipe';
import CommentEditor from '~/components/common/CommentEditor';

function RecipeCommentEditor() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const id = parseInt(router?.query.id as string);
  const queryClient = useQueryClient();

  const { mutateAsync: createComment } = useMutation(postRecipeComment, {
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', id]);
      queryClient.invalidateQueries(['comments', id]);
    },
  });

  const onChangeContent = (value: string) => {
    setContent(value);
  };

  const onSubmitComment = async () => {
    await createComment({
      id,
      request: {
        content,
        targetCommentId: null,
      },
    });
  };

  return <CommentEditor onChange={onChangeContent} onConfirm={onSubmitComment} />;
}

export default RecipeCommentEditor;

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

  const handleChangeContent = (value: string) => {
    setContent(value);
  };

  const handleSubmitComment = async () => {
    await createComment({
      id,
      request: {
        content,
        targetCommentId: null,
      },
    });
  };

  return <CommentEditor onChange={handleChangeContent} onConfirm={handleSubmitComment} />;
}

export default RecipeCommentEditor;

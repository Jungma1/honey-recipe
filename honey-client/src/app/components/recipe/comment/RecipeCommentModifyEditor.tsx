import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { patchRecipeComment } from '~/apis/recipe';
import CommentEditor from '~/components/common/CommentEditor';

interface Props {
  defaultContent: string;
  targetCommentId: number;
  onClose: () => void;
  onChangeContent: (value: string) => void;
}

function RecipeCommentModifyEditor({
  defaultContent,
  targetCommentId,
  onClose,
  onChangeContent,
}: Props) {
  const router = useRouter();
  const [content, setContent] = useState(defaultContent);
  const id = parseInt(router?.query.id as string);

  const { mutateAsync: updateComment } = useMutation(patchRecipeComment, {
    onSuccess: () => {
      onChangeContent(content);
    },
  });

  const onChangeValue = (value: string) => {
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
      onChangeValue={onChangeValue}
      onConfirm={onSubmitComment}
      onClose={onClose}
      defaultButtonVisible
    />
  );
}

export default RecipeCommentModifyEditor;

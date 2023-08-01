import styled from '@emotion/styled';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { rem } from 'polished';
import { useState } from 'react';
import { postRecipeComment } from '~/apis/recipe';
import Editor from '~/components/common/Editor';
import Button from '~/components/system/Button';

function RecipeCommentEditor() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [isClick, setIsClick] = useState(false);
  const queryClient = useQueryClient();

  const id = parseInt(router?.query.id as string);

  const postCommentMutation = useMutation((content: string) => postRecipeComment(id, content), {
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', id]);
    },
  });

  const onChangeText = (value: string) => {
    setText(value);
  };

  const onClickSubmit = async () => {
    await postCommentMutation.mutateAsync(text);
  };

  return (
    <Block>
      <Editor onChangeValue={onChangeText} onClick={() => setIsClick(true)} />
      <AnimatePresence>
        {isClick && (
          <ButtonGroup initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <StyledButton onClick={() => setIsClick(false)} outlined>
              취소
            </StyledButton>
            <StyledButton onClick={onClickSubmit}>작성</StyledButton>
          </ButtonGroup>
        )}
      </AnimatePresence>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(16)};
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  padding: ${rem(8)} ${rem(16)};
`;

export default RecipeCommentEditor;

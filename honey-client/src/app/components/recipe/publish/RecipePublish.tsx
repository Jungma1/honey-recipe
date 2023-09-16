import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { rem } from 'polished';
import { useEffect } from 'react';
import Button from '~/components/system/Button';
import { useEditorStore } from '~/stores/editor';
import { colors } from '~/utils/colors';

function RecipePublish() {
  const { isPublish, closePublish } = useEditorStore();

  const handleClickClosePublish = () => {
    closePublish();
  };

  useEffect(() => {
    () => closePublish();
  }, [closePublish]);

  return (
    <AnimatePresence>
      {isPublish && (
        <>
          <Fill initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <Block>
            <Wrapper initial={{ y: 20 }} animate={{ y: 0 }} exit={{ height: 0 }}>
              <Content>
                <ButtonGroup>
                  <Button onClick={handleClickClosePublish} outlined>
                    취소
                  </Button>
                  <Button>수정하기</Button>
                </ButtonGroup>
              </Content>
            </Wrapper>
          </Block>
        </>
      )}
    </AnimatePresence>
  );
}

const Fill = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
`;

const Block = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Wrapper = styled(motion.div)`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: ${colors.white};
  box-shadow: 0px -4px 20px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  max-width: 768px;
  margin: auto;
  padding: ${rem(32)} ${rem(16)};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${rem(14)};
`;

export default RecipePublish;

import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { rem } from 'polished';
import { useModalStore } from '~/stores/modal';
import { colors } from '~/utils/colors';
import Button from '../system/Button';

function ModalContainer() {
  const { isOpen, title, description, onConfirm, closeModal } = useModalStore();

  const handleClickConfirm = () => {
    closeModal();
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Block
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
          >
            <Background onClick={closeModal} />
            <ModalBlock>
              <Title>{title}</Title>
              <Description>{description}</Description>
              <ButtonGroup>
                <StyledButton onClick={closeModal} outlined>
                  취소
                </StyledButton>
                <StyledButton onClick={handleClickConfirm}>확인</StyledButton>
              </ButtonGroup>
            </ModalBlock>
          </Block>
        </>
      )}
    </AnimatePresence>
  );
}

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0.3;
`;

const Block = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

const ModalBlock = styled.div`
  z-index: 20;
  width: 375px;
  display: flex;
  flex-direction: column;
  background: ${colors.white};
  padding: ${rem(24)} ${rem(32)};
  border-radius: ${rem(8)};
`;

const Title = styled.span`
  color: ${colors.gray9};
  font-size: ${rem(18)};
  font-weight: bold;
  margin-bottom: ${rem(8)};
`;

const Description = styled.span`
  color: ${colors.gray6};
  font-size: ${rem(16)};
  margin-bottom: ${rem(32)};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${rem(8)};
`;

const StyledButton = styled(Button)`
  padding: ${rem(8)} ${rem(16)};
`;

export default ModalContainer;

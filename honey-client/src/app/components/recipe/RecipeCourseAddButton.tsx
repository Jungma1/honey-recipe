import styled from '@emotion/styled';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import { motion } from 'framer-motion';
import { rem } from 'polished';
import { useMotionVertical } from '~/hooks/useMotionVertical';
import { colors } from '~/utils/colors';

interface Props {
  onClick: () => void;
}

function RecipeCourseAddButton({ onClick }: Props) {
  const { y, handleMouseEnter, handleMouseLeave } = useMotionVertical(5);

  return (
    <Block onClick={onClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <AnimationBlock animate={{ y }}>
        <NoteAddRoundedIcon fontSize="large" />
        <Text>레시피 요리과정 추가</Text>
      </AnimationBlock>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${rem(32)} 0;
  border: ${rem(2)} solid ${colors.gray0};
  border-radius: ${rem(5)};
  cursor: pointer;

  svg {
    color: ${colors.gray2};
  }
`;

const AnimationBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${rem(8)};
`;

const Text = styled.div`
  color: ${colors.gray3};
  font-weight: 600;
`;

export default RecipeCourseAddButton;

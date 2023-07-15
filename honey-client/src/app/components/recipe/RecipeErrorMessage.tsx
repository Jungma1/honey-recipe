import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { colors } from '~/utils/colors';

interface Props {
  message: string;
}

function RecipeErrorMessage({ message }: Props) {
  if (!message) return <></>;

  return (
    <ErrorMessage initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      {message}
    </ErrorMessage>
  );
}

const ErrorMessage = styled(motion.div)`
  text-align: center;
  color: ${colors.danger};
  font-weight: bold;
`;

export default RecipeErrorMessage;

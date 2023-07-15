import styled from '@emotion/styled';
import { rem } from 'polished';
import { colors } from '~/utils/colors';

interface Props {
  label: string;
  children: React.ReactNode;
}

function LabelGroup({ label, children }: Props) {
  return (
    <Block>
      <Label>{label}</Label>
      {children}
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: ${colors.gray9};
  font-size: ${rem(16)};
  font-weight: 600;
  margin-bottom: ${rem(8)};
`;

export default LabelGroup;

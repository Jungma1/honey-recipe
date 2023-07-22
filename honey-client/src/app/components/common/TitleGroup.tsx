import styled from '@emotion/styled';
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded';
import { rem } from 'polished';
import React from 'react';
import { colors } from '~/utils/colors';

interface Props {
  children: React.ReactNode;
  title: string;
}

function TitleGroup({ children, title }: Props) {
  return (
    <Block>
      <Title>
        <ClearAllRoundedIcon />
        {title}
      </Title>
      {children}
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};
`;

const Title = styled.div`
  display: flex;
  gap: ${rem(8)};
  color: ${colors.primary};
  font-weight: bold;
  font-size: ${rem(20)};
  padding-bottom: ${rem(8)};
  border-bottom: 2px solid ${colors.primary};
`;

export default TitleGroup;

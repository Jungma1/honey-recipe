import styled from '@emotion/styled';
import { rem } from 'polished';
import React from 'react';
import { colors } from '~/utils/colors';

interface Props {
  title: string;
  children: React.ReactNode;
}

function PublishSelector({ title, children }: Props) {
  return (
    <Block>
      <Title>{title}</Title>
      {children}
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.span`
  font-weight: 600;
  color: ${colors.gray9};
  margin-right: ${rem(32)};
`;

export default PublishSelector;

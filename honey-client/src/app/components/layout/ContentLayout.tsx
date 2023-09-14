import styled from '@emotion/styled';
import { rem } from 'polished';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

function ContentLayout({ children }: Props) {
  return <Block>{children}</Block>;
}

const Block = styled.main`
  flex: 1;
  padding: ${rem(32)};
`;

export default ContentLayout;

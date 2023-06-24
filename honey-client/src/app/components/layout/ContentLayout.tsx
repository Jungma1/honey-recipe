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
  padding: 0 ${rem(32)};
  padding-bottom: ${rem(32)};
`;

export default ContentLayout;

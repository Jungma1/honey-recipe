import styled from '@emotion/styled';
import { colors } from '~/utils/colors';

interface Props {
  children: React.ReactNode;
}

function MainLayout({ children }: Props) {
  return <Main>{children}</Main>;
}

const Main = styled.main`
  min-height: 100%;
  max-width: 768px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  background-color: ${colors.white};
`;

export default MainLayout;

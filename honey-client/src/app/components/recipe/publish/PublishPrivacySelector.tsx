import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { rem } from 'polished';
import { useEditorStore } from '~/stores/editor';
import { colors } from '~/utils/colors';
import PublishSelector from './PublishSelector';

function PublishPrivacySelector() {
  const { isPrivate, setIsPrivate } = useEditorStore();

  const handleClickPublic = () => {
    setIsPrivate(false);
  };

  const handleClickPrivate = () => {
    setIsPrivate(true);
  };

  return (
    <PublishSelector title="공개 여부">
      <Wrapper>
        <Button active={!isPrivate} onClick={handleClickPublic}>
          공개
        </Button>
        <Button active={isPrivate} onClick={handleClickPrivate}>
          비공개
        </Button>
      </Wrapper>
    </PublishSelector>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${rem(12)};
`;

const Button = styled.button<{ active: boolean }>`
  cursor: pointer;
  padding: ${rem(4)} ${rem(8)};
  font-size: ${rem(14)};
  color: ${colors.gray9};
  background: ${colors.gray0};
  border-radius: ${rem(4)};

  ${(props) =>
    props.active &&
    css`
      font-weight: 600;
      color: ${colors.white};
      background: ${colors.primary};
    `}
`;

export default PublishPrivacySelector;

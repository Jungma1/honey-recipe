import styled from '@emotion/styled';
import { EditorView, minimalSetup } from 'codemirror';
import { motion } from 'framer-motion';
import { rem } from 'polished';
import { useEffect, useRef, useState } from 'react';
import { colors } from '~/utils/colors';
import Button from '../system/Button';

interface Props {
  defaultValue?: string;
  defaultButtonVisible?: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  onChange: (value: string) => void;
}

const editorTheme = EditorView.theme({
  '.cm-content': {
    fontFamily: `Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue',
    'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif`,
  },
});

function CommentEditor({
  defaultValue,
  defaultButtonVisible,
  onChange,
  onConfirm,
  onClose,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const defaultValueRef = useRef(defaultValue);
  const [isButtonVisible, setIsButtonVisible] = useState(defaultButtonVisible ?? false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (viewRef.current) return;
    if (!editorRef.current) return;

    const view = new EditorView({
      doc: defaultValueRef.current,
      parent: editorRef.current,
      extensions: [
        minimalSetup,
        editorTheme,
        EditorView.lineWrapping,
        EditorView.updateListener.of((value) => {
          onChangeRef.current(value.state.doc.toString());
        }),
      ],
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  const handleClickCancel = () => {
    if (!viewRef.current) return;

    onClose?.();
    setIsButtonVisible(false);

    const transaction = viewRef.current.state.update({
      changes: { from: 0, to: viewRef.current.state.doc.length, insert: '' },
    });
    viewRef.current.dispatch(transaction);
  };

  const handleClickConfirm = () => {
    onConfirm();
    handleClickCancel();
    onClose?.();
  };

  return (
    <Container>
      <Block ref={editorRef} onFocus={() => setIsButtonVisible(true)} />
      {isButtonVisible && (
        <ButtonGroup initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <StyledButton onClick={handleClickCancel} size="small" outlined>
            취소
          </StyledButton>
          <StyledButton onClick={handleClickConfirm} size="small">
            작성
          </StyledButton>
        </ButtonGroup>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(16)};
`;

const Block = styled.div`
  color: ${colors.gray9};
  font-size: ${rem(16)};
  border-radius: ${rem(4)};
  border: 1px solid ${colors.gray2};

  :focus-within {
    border-color: ${colors.primary};
  }

  .cm-editor,
  .cm-gutter {
    height: 100%;
    padding: ${rem(8)} 0;
  }

  .cm-gutters {
    margin: 1px;
  }

  .cm-content {
    padding: 0;
  }

  .cm-line {
    padding: 0 ${rem(12)};
  }

  .cm-scroller {
    overflow: auto;
  }

  .cm-focused {
    outline: none;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  padding: ${rem(8)} ${rem(16)};
`;

export default CommentEditor;

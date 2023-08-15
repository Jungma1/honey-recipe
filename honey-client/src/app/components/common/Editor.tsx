import styled from '@emotion/styled';
import { EditorView, minimalSetup } from 'codemirror';
import { rem } from 'polished';
import { useEffect, useRef } from 'react';
import { colors } from '~/utils/colors';

interface Props {
  defaultValue?: string;
  onChangeValue: (value: string) => void;
}

const editorTheme = EditorView.theme({
  '.cm-content': {
    fontFamily: `Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue',
    'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif`,
  },
});

function Editor({ defaultValue, onChangeValue, ...rest }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChangeValue);
  const defaultValueRef = useRef(defaultValue);

  useEffect(() => {
    onChangeRef.current = onChangeValue;
  }, [onChangeValue]);

  useEffect(() => {
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

    return () => {
      view.destroy();
    };
  }, []);

  return <Block ref={editorRef} {...rest} />;
}

const Block = styled.div`
  color: ${colors.gray9};
  font-size: ${rem(16)};
  border-radius: ${rem(4)};
  border: 1px solid ${colors.gray2};
  cursor: text;

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

export default Editor;

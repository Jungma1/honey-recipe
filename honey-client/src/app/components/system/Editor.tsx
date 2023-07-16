import styled from '@emotion/styled';
import { EditorView, minimalSetup } from 'codemirror';
import { rem } from 'polished';
import { useEffect, useRef } from 'react';
import { colors } from '~/utils/colors';

interface Props {
  defaultValue?: string;
  onChange: (value: string) => void;
}

function Editor({ defaultValue, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    if (!editorRef.current) return;

    const view = new EditorView({
      doc: defaultValue,
      parent: editorRef.current,
      extensions: [
        minimalSetup,
        EditorView.lineWrapping,
        EditorView.updateListener.of((value) => {
          onChangeRef.current(value.state.doc.toString());
        }),
      ],
    });

    return () => {
      view.destroy();
    };
  }, [defaultValue]);

  return <Block ref={editorRef} />;
}

const Block = styled.div`
  color: ${colors.gray9};
  font-size: ${rem(16)};
  border-radius: ${rem(4)};
  border: 1px solid ${colors.gray4};

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
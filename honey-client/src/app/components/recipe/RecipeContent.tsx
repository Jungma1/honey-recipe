import styled from '@emotion/styled';
import { rem } from 'polished';
import Editor from '../system/Editor';
import Input from '../system/Input';
import LabelGroup from '../system/LabelGroup';

interface Props {
  title: string;
  onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (value: string) => void;
}

function RecipeContent({ title, onChangeTitle, onChangeDescription }: Props) {
  return (
    <Block>
      <LabelGroup label="제목">
        <Input value={title} onChange={onChangeTitle} />
      </LabelGroup>
      <LabelGroup label="설명">
        <Editor onChange={onChangeDescription} />
      </LabelGroup>
    </Block>
  );
}

const Block = styled.div`
  flex: auto;
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};

  div:nth-child(2) {
    flex: 1;
  }
`;

export default RecipeContent;

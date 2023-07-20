import styled from '@emotion/styled';
import { rem } from 'polished';
import Editor from '../system/Editor';
import Input from '../system/Input';
import LabelGroup from '../system/LabelGroup';
import RecipeImageSelector from './RecipeImageSelector';

interface Props {
  title: string;
  description?: string;
  imagePath: string | null;
  onClickImage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (value: string) => void;
}

function RecipeEditor({
  title,
  description,
  imagePath,
  onClickImage,
  onChangeTitle,
  onChangeDescription,
}: Props) {
  return (
    <Block>
      <RecipeImageSelector imagePath={imagePath} onClickImage={onClickImage} />
      <Wrapper>
        <LabelGroup label="제목">
          <Input value={title} onChange={onChangeTitle} />
        </LabelGroup>
        <LabelGroup label="설명">
          <Editor onChangeValue={onChangeDescription} defaultValue={description} />
        </LabelGroup>
      </Wrapper>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  gap: ${rem(32)};
`;

const Wrapper = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: ${rem(32)};

  div:last-of-type {
    flex: 1;
  }
`;

export default RecipeEditor;

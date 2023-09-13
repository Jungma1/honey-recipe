import styled from '@emotion/styled';
import { rem } from 'polished';
import Editor from '../common/Editor';
import LabelGroup from '../common/LabelGroup';
import Button from '../system/Button';
import Input from '../system/Input';
import RecipeImageSelector from './RecipeImageSelector';

interface Props {
  title: string;
  description?: string;
  imagePath: string | null;
  isPrivate: boolean;
  onClickImage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickRemoveImage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDescription: (value: string) => void;
  onClickIsPublic: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickIsPrivate: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function RecipeEditor({
  title,
  description,
  imagePath,
  isPrivate,
  onClickImage,
  onClickRemoveImage,
  onChangeTitle,
  onChangeDescription,
  onClickIsPublic,
  onClickIsPrivate,
}: Props) {
  return (
    <Block>
      <Info>
        <RecipeImageSelector
          imagePath={imagePath}
          onClickUpload={onClickImage}
          onClickRemove={onClickRemoveImage}
        />
        <Wrapper>
          <LabelGroup label="레시피 이름">
            <Input value={title} onChange={onChangeTitle} />
          </LabelGroup>
          <LabelGroup label="레시피 설명">
            <Editor onChangeValue={onChangeDescription} defaultValue={description} />
          </LabelGroup>
        </Wrapper>
      </Info>
      <LineBlock>
        <LineEmpty />
        <LineContent>
          <LabelGroup label="레시피 공개 설정">
            <ButtonGroup>
              <Button onClick={onClickIsPublic} twoTone={isPrivate}>
                공개
              </Button>
              <Button onClick={onClickIsPrivate} twoTone={!isPrivate}>
                비공개
              </Button>
            </ButtonGroup>
          </LabelGroup>
        </LineContent>
      </LineBlock>
    </Block>
  );
}

const Block = styled.div``;

const Info = styled.div`
  display: flex;
  gap: ${rem(32)};
  margin-bottom: ${rem(32)};
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

const LineBlock = styled.div`
  display: flex;
  gap: ${rem(32)};
`;

const LineEmpty = styled.span`
  flex: 1;
`;

const LineContent = styled.div`
  flex: 2;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${rem(16)};

  button {
    flex: 1;
  }
`;

export default RecipeEditor;

import styled from '@emotion/styled';
import { rem } from 'polished';
import { RecipeCourse } from '~/apis/types';
import AutoImage from '../system/AutoImage';
import Editor from '../system/Editor';
import Input from '../system/Input';
import LabelGroup from '../system/LabelGroup';

interface Props {
  course: RecipeCourse;
  onChangeForm: (id: number, key: string, value: string) => void;
  onClickImage: (id: number) => void;
}

function RecipeCourseEditor({ course, onChangeForm, onClickImage }: Props) {
  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeForm(course.id, e.target.name, e.target.value);
  };

  const onChangeContent = (value: string) => {
    onChangeForm(course.id, 'content', value);
  };

  const onClickPicture = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClickImage(course.id);
  };

  return (
    <Block>
      <ImageWrapper onClick={onClickPicture}>
        <AutoImage src={course.picture ?? '/test.png'} />
      </ImageWrapper>
      <Wrapper>
        <LabelGroup label="제목">
          <Input name="title" value={course.title} onChange={onChangeTitle} />
        </LabelGroup>
        <LabelGroup label="내용">
          <Editor onChangeValue={onChangeContent} defaultValue={course.content} />
        </LabelGroup>
      </Wrapper>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  gap: ${rem(32)};
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  cursor: pointer;
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

export default RecipeCourseEditor;

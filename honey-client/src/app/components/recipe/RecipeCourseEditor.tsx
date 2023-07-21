import styled from '@emotion/styled';
import { rem } from 'polished';
import { RecipeCourse } from '~/apis/types';
import AutoImage from '../system/AutoImage';
import Editor from '../system/Editor';
import LabelGroup from '../system/LabelGroup';

interface Props {
  course: RecipeCourse;
  onChangeContent: (id: number, value: string) => void;
  onClickImage: (id: number) => void;
}

function RecipeCourseEditor({ course, onChangeContent, onClickImage }: Props) {
  const onChangeContentValue = (value: string) => {
    onChangeContent(course.id, value);
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
        <LabelGroup label="내용">
          <Editor onChangeValue={onChangeContentValue} defaultValue={course.content} />
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

  div:last-of-type {
    flex: 1;
  }
`;

export default RecipeCourseEditor;

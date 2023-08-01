import styled from '@emotion/styled';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import { rem } from 'polished';
import { useState } from 'react';
import { RecipeCourse } from '~/apis/types';
import { colors } from '~/utils/colors';
import Editor from '../common/Editor';
import LabelGroup from '../common/LabelGroup';
import AutoImage from '../system/AutoImage';
import Button from '../system/Button';

interface Props {
  course: RecipeCourse;
  step: number;
  onChangeContent: (id: number, value: string) => void;
  onClickRemove: (id: number) => void;
  onClickImage: (id: number) => void;
  onClickRemoveImage: (id: number) => void;
}

function RecipeCourseEditor({
  step,
  course,
  onChangeContent,
  onClickRemove,
  onClickImage,
  onClickRemoveImage,
}: Props) {
  const [isHover, setIsHover] = useState(false);

  const onChangeContentValue = (value: string) => {
    onChangeContent(course.id, value);
  };

  const onClickPicture = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    onClickImage(course.id);
  };

  const onClickRemoveCourse = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClickRemove(course.id);
  };

  const onClickRemovePicture = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClickRemoveImage(course.id);
  };

  return (
    <Block>
      <Wrapper>
        <ImageWrapper
          onClick={onClickPicture}
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          <AutoImage src={course.picture ?? '/test.png'} />
          {isHover && <ImageRemoveIcon onClick={onClickRemovePicture} />}
        </ImageWrapper>
        <EditorWrapper>
          <LabelGroup label={`Step ${step}`}>
            <Editor onChangeValue={onChangeContentValue} defaultValue={course.content} />
          </LabelGroup>
        </EditorWrapper>
      </Wrapper>
      <Button onClick={onClickRemoveCourse} danger>
        Step {step} 지우기
      </Button>
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(16)};
  padding-bottom: ${rem(32)};
  border-bottom: 1px solid ${colors.gray0};
`;

const Wrapper = styled.div`
  display: flex;
  gap: ${rem(32)};
`;

const ImageWrapper = styled.div`
  flex: 1;
  display: flex;
  cursor: pointer;
  position: relative;

  img {
    border-radius: ${rem(8)};
  }
`;

const ImageRemoveIcon = styled(DisabledByDefaultRoundedIcon)`
  right: 0;
  width: ${rem(32)};
  height: ${rem(32)};
  position: absolute;
  color: ${colors.gray2};
`;

const EditorWrapper = styled.div`
  flex: 2;
  display: flex;

  div:last-of-type {
    flex: 1;
  }
`;

export default RecipeCourseEditor;

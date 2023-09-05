import styled from '@emotion/styled';
import {
  Add,
  DisabledByDefaultRounded,
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
  Remove,
} from '@mui/icons-material';
import { rem } from 'polished';
import React, { useState } from 'react';
import { RecipeCourse } from '~/apis/types';
import { defaultPictureImage } from '~/static';
import { colors } from '~/utils/colors';
import Editor from '../common/Editor';
import LabelGroup from '../common/LabelGroup';
import AutoImage from '../system/AutoImage';

interface Props {
  course: RecipeCourse;
  step: number;
  onChangeContent: (id: number, value: string) => void;
  onClickRemove: (id: number) => void;
  onClickImage: (id: number) => void;
  onClickAddCourse: (id: number) => void;
  onClickRemoveImage: (id: number) => void;
  onClickChangeOrderUp: (id: number) => void;
  onClickChangeOrderDown: (id: number) => void;
}

function RecipeCourseEditor({
  step,
  course,
  onChangeContent,
  onClickRemove,
  onClickImage,
  onClickAddCourse,
  onClickRemoveImage,
  onClickChangeOrderUp,
  onClickChangeOrderDown,
}: Props) {
  const [isHover, setIsHover] = useState(false);

  const handleChangeContentValue = (value: string) => {
    onChangeContent(course.id, value);
  };

  const handleClickPicture = (e: React.MouseEvent<HTMLDivElement>) => {
    onClickImage(course.id);
  };

  const handleClickAddCourse = (e: React.MouseEvent<HTMLDivElement>) => {
    onClickAddCourse(course.id);
  };

  const handleClickRemoveCourse = (e: React.MouseEvent<HTMLDivElement>) => {
    onClickRemove(course.id);
  };

  const handleClickRemovePicture = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    onClickRemoveImage(course.id);
  };

  const handleClickChangeOrderUp = (e: React.MouseEvent<HTMLDivElement>) => {
    onClickChangeOrderUp(course.id);
  };

  const handleClickChangeOrderDown = (e: React.MouseEvent<HTMLDivElement>) => {
    onClickChangeOrderDown(course.id);
  };

  return (
    <Block>
      <Wrapper>
        <ImageWrapper
          onClick={handleClickPicture}
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          <AutoImage src={course.picture ?? defaultPictureImage} />
          {isHover && <ImageRemoveIcon onClick={handleClickRemovePicture} />}
        </ImageWrapper>
        <EditorWrapper>
          <LabelGroup label={`Step ${step}`}>
            <Editor onChangeValue={handleChangeContentValue} defaultValue={course.content} />
          </LabelGroup>
        </EditorWrapper>
      </Wrapper>
      <StepWrapper>
        <StepIcon onClick={handleClickChangeOrderUp}>
          <KeyboardArrowUpRounded />
        </StepIcon>
        <StepIcon onClick={handleClickChangeOrderDown}>
          <KeyboardArrowDownRounded />
        </StepIcon>
        <StepIcon onClick={handleClickAddCourse}>
          <Add />
        </StepIcon>
        <StepIcon onClick={handleClickRemoveCourse}>
          <Remove />
        </StepIcon>
      </StepWrapper>
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

const StepWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${rem(4)};
`;

const StepIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.gray6};
  border-radius: ${rem(4)};
  border: ${rem(1)} solid ${colors.gray2};
  cursor: pointer;

  :hover {
    color: ${colors.primary};
    border-color: ${colors.primary};
  }
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

const ImageRemoveIcon = styled(DisabledByDefaultRounded)`
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

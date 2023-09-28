import styled from '@emotion/styled';
import AddIcon from '@mui/icons-material/Add';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import RemoveIcon from '@mui/icons-material/Remove';
import { useMutation } from '@tanstack/react-query';
import { rem } from 'polished';
import React, { useState } from 'react';
import { postRecipeImage } from '~/apis/recipe';
import { RecipeCourse } from '~/apis/types';
import Editor from '~/components/common/Editor';
import LabelGroup from '~/components/common/LabelGroup';
import AutoImage from '~/components/system/AutoImage';
import { defaultPictureImage } from '~/static';
import { useEditorStore } from '~/stores/editor';
import { colors } from '~/utils/colors';
import { upload } from '~/utils/file';

interface Props {
  step: number;
  course: RecipeCourse;
}

function RecipeCourseEditor({ step, course }: Props) {
  const [isHover, setIsHover] = useState(false);
  const { courses, setCourses, setContent, setPicture, removeCourse } = useEditorStore();

  const { mutateAsync: uploadPicture } = useMutation(postRecipeImage, {
    onSuccess: ({ imagePath }) => {
      setPicture(course.id, imagePath);
    },
  });

  const handleChangeContent = (value: string) => {
    setContent(course.id, value);
  };

  const handleClickAddCourse = () => {
    const tempCourses = courses;
    tempCourses.splice(step + 1, 0, {
      id: Math.random(),
      content: '',
      picture: null,
      created: false,
    });
    setCourses(tempCourses);
  };

  const handleClickRemoveCourse = () => {
    removeCourse(course.id);
  };

  const handleClickUploadPicture = async () => {
    const file = await upload();
    if (!file) return;
    await uploadPicture(file);
  };

  const handleClickRemovePicture = (e: React.MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    setPicture(course.id, null);
  };

  const handleClickChangeOrderUp = () => {
    if (step === 0) return;

    const tempCourses = courses;
    const [movedCourse] = tempCourses.splice(step, 1);
    tempCourses.splice(step - 1, 0, movedCourse);
    setCourses(tempCourses);
  };

  const handleClickChangeOrderDown = () => {
    if (step === courses.length - 1) return;

    const tempCourses = courses;
    const [movedCourse] = tempCourses.splice(step, 1);
    tempCourses.splice(step + 1, 0, movedCourse);
    setCourses(tempCourses);
  };

  return (
    <Block>
      <Wrapper>
        <ImageWrapper
          onClick={handleClickUploadPicture}
          onMouseOver={() => setIsHover(true)}
          onMouseOut={() => setIsHover(false)}
        >
          <AutoImage src={course.picture ?? defaultPictureImage} />
          {course.picture && isHover && <ImageRemoveIcon onClick={handleClickRemovePicture} />}
        </ImageWrapper>
        <EditorWrapper>
          <LabelGroup label={`Step ${step + 1}`}>
            <Editor onChangeValue={handleChangeContent} defaultValue={course.content} />
          </LabelGroup>
        </EditorWrapper>
      </Wrapper>
      <StepWrapper>
        <StepIcon onClick={handleClickChangeOrderUp}>
          <KeyboardArrowUpRoundedIcon />
        </StepIcon>
        <StepIcon onClick={handleClickChangeOrderDown}>
          <KeyboardArrowDownRoundedIcon />
        </StepIcon>
        <StepIcon onClick={handleClickAddCourse}>
          <AddIcon />
        </StepIcon>
        <StepIcon onClick={handleClickRemoveCourse}>
          <RemoveIcon />
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
  flex-direction: column;
  cursor: pointer;
  position: relative;

  img {
    border-radius: ${rem(8)};
  }
`;

const ImageRemoveIcon = styled(ClearRoundedIcon)`
  right: 0;
  width: ${rem(32)};
  height: ${rem(32)};
  position: absolute;
  color: ${colors.white};
  background: ${colors.black};
  border-radius: ${rem(4)};
`;

const EditorWrapper = styled.div`
  flex: 2;
  display: flex;

  div:last-of-type {
    flex: 1;
  }
`;

export default RecipeCourseEditor;

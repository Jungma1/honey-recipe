import styled from '@emotion/styled';
import { rem } from 'polished';
import { RecipeCourse } from '~/apis/types';
import RecipeCourseItem from './RecipeCourseItem';

interface Props {
  course: RecipeCourse[];
}

function RecipeCourseList({ course }: Props) {
  return (
    <Block>
      {course.map((item, index) => (
        <RecipeCourseItem key={item.id} step={index} course={item} />
      ))}
    </Block>
  );
}

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${rem(48)};
  padding: ${rem(64)} 0;
`;

export default RecipeCourseList;

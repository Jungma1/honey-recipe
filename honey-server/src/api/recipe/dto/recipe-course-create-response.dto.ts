import { RecipeCourse } from '@prisma/client';

export class RecipeCourseCreateResponseDto {
  id: number;
  title: string;
  content: string;
  picture: string | null;

  constructor(course: RecipeCourse) {
    this.id = course.id;
    this.title = course.title;
    this.content = course.content;
    this.picture = course.picture;
  }
}

import { RecipeCourse } from '@prisma/client';

export class RecipeCourseResponseDto {
  id: number;
  title: string;
  content: string;
  picture: string | null;
  created: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(recipeCourse: RecipeCourse) {
    this.id = recipeCourse.id;
    this.title = recipeCourse.title;
    this.content = recipeCourse.content;
    this.picture = recipeCourse.picture || null;
    this.created = true;
    this.createdAt = recipeCourse.createdAt;
    this.updatedAt = recipeCourse.updatedAt;
  }
}

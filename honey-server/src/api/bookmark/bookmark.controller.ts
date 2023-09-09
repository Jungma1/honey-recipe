import { Controller } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';

@Controller()
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}
}

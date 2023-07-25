export class Page<T> {
  page: number;
  size: number;
  totalCount: number;
  totalPage: number;
  isLast: boolean;
  items: T[];

  constructor(totalCount: number, page: number, size: number, items: T[]) {
    this.page = page;
    this.size = size;
    this.totalCount = totalCount;
    this.totalPage = Math.ceil(totalCount / size);
    this.isLast = this.totalPage <= page;
    this.items = items;
  }
}

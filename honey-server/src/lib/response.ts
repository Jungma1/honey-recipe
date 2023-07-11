export class Response<T> {
  data: T[];

  constructor(data: T[]) {
    this.data = data;
  }
}

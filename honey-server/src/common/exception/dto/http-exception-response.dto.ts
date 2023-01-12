export class HttpExceptionResponseDto {
  constructor(private statusCode: number, private message: string) {}
}

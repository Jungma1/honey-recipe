import { FileValidator, Injectable } from '@nestjs/common';

interface MultiFileTypeValidatorOptions {
  fileTypes: string[];
}

@Injectable()
export class MultiFileTypeValidator extends FileValidator {
  constructor(options: MultiFileTypeValidatorOptions) {
    super(options);
  }

  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    const fileType = file.mimetype.split('/')[1];
    return this.validationOptions.fileTypes.includes(fileType);
  }

  buildErrorMessage(): string {
    return `File type must be one of [${this.validationOptions.fileTypes}]`;
  }
}

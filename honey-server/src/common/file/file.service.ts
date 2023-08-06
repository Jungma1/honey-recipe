import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as mimeTypes from 'mime-types';
import { nanoid } from 'nanoid';

interface KeyPayload {
  id: number;
  type: 'avatar' | 'recipe';
  extension: string;
}

@Injectable()
export class FileService {
  private readonly R2: S3Client;
  private readonly BUCKET_NAME: string;

  constructor(private readonly configService: ConfigService) {
    this.R2 = new S3Client({
      region: 'auto',
      endpoint: configService.get<string>('R2_ENDPOINT'),
      credentials: {
        accessKeyId: configService.get<string>('R2_ACCESS_KEY'),
        secretAccessKey: configService.get<string>('R2_SECRET_KEY'),
      },
    });
    this.BUCKET_NAME = configService.get<string>('R2_BUCKET_NAME');
  }

  async uploadFile(key: string, file: Buffer) {
    const mimeType = mimeTypes.lookup(key) || 'image/png';

    return this.R2.send(
      new PutObjectCommand({
        Bucket: this.BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: mimeType,
      }),
    );
  }

  async generateKey({ id, type, extension }: KeyPayload) {
    return `images/${type}/${id}/${nanoid()}.${extension}`;
  }

  async generateFile(url: string) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const extension = mimeTypes.extension(response.headers['content-type']);

    return { buffer, extension };
  }

  async generateUrl(key: string) {
    return `https://cdn.kkulpi.com/${key}`;
  }
}

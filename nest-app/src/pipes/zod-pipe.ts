import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { ZodObject, ZodError } from 'zod';

export class ZodPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      this.schema.parse(value);
    } catch (e) {
      const error = e as ZodError;
      const meta = error.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      }));
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: "Bad Request",
        meta,
      });
    }
    return value;
  }
}

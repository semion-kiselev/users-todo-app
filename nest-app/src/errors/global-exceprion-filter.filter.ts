import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { getReasonPhrase } from "http-status-codes";

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  catch(exception: object, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if ("code" in exception && exception.code === "23505") {
      this.sendResponse(response, HttpStatus.CONFLICT);
      return;
    }

    if ("code" in exception && exception.code === "23503") {
      this.sendResponse(response, HttpStatus.BAD_REQUEST);
      return;
    }

    super.catch(exception, host);
  }

  private sendResponse(response: Response, statusCode: number) {
    response.status(statusCode).json({
      statusCode,
      message: getReasonPhrase(statusCode),
    });
  }
}

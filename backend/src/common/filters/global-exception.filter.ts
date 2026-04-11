import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AppRequest } from '../interfaces';
import { ApiErrorResponse } from '../interfaces';

/**
 * Global filters
 *
 * Estructure: { error: { code, message, statusCode }, meta: { timestamp, path, requestId } }
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{
      status: (code: number) => {
        json: (body: ApiErrorResponse) => void;
      };
    }>();
    const request = ctx.getRequest<AppRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.extractMessage(exception);
    const errorCode = this.mapStatusToCode(status);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    } else {
      this.logger.warn(
        `${request.method} ${request.url} → ${status}: ${JSON.stringify(message)}`,
      );
    }

    const errorResponse: ApiErrorResponse = {
      error: {
        code: errorCode,
        message,
        statusCode: status,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        requestId: request.requestId ?? uuidv4(),
      },
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Extract message from exception
   */
  private extractMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return response;
      }

      if (typeof response === 'object' && response !== null) {
        const responseObj = response as Record<string, unknown>;

        if (Array.isArray(responseObj.message)) {
          return responseObj.message as string[];
        }

        if (typeof responseObj.message === 'string') {
          return responseObj.message;
        }
      }
    }

    return 'Error interno del servidor';
  }

  private mapStatusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_ERROR',
    };
    return map[status] ?? 'UNKNOWN_ERROR';
  }
}

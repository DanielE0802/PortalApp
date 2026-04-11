import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { AppRequest } from '../interfaces';

/**
 * Logger interceptor for HTTP requests
 * Generates a unique request ID and logs request details
 */

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AppRequest>();
    const response = context.switchToHttp().getResponse<{
      setHeader: (name: string, value: string) => void;
      statusCode: number;
    }>();

    const requestId = uuidv4();
    request.requestId = requestId;
    response.setHeader('X-Request-Id', requestId);

    const { method, url } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        this.logger.log(
          `${method} ${url} → ${response.statusCode} [${duration}ms] reqId:${requestId}`,
        );
      }),
    );
  }
}

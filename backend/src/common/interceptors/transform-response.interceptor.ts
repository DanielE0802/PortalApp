import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppRequest } from '../interfaces';

/**
 * Transform response interceptor
 * { data: <response>, meta: { timestamp, requestId } }
 */
@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AppRequest>();

    return next.handle().pipe(
      map((data: unknown) => {
        if (data && typeof data === 'object' && 'data' in data) {
          const response = data as Record<string, unknown>;
          if (response.meta && typeof response.meta === 'object') {
            (response.meta as Record<string, unknown>).requestId =
              request.requestId;
            (response.meta as Record<string, unknown>).timestamp =
              new Date().toISOString();
          }
          return data;
        }

        return {
          data,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: request.requestId,
          },
        };
      }),
    );
  }
}

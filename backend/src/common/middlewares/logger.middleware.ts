import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();

    req['requestId'] = requestId;
    res.setHeader('X-Request-Id', requestId);

    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;

      if (statusCode >= 500) {
        this.logger.error(
          `${method} ${originalUrl}: ${statusCode} [${duration}ms] requestId:${requestId}`,
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          `${method} ${originalUrl}: ${statusCode} [${duration}ms] requestId:${requestId}`,
        );
      } else {
        this.logger.log(
          `${method} ${originalUrl}: ${statusCode} [${duration}ms] requestId:${requestId}`,
        );
      }
    });

    next();
  }
}

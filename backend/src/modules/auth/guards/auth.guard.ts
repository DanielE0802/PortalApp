import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';
import { AppRequest } from '../../../common/interfaces';

/**
 * Global authentication guard.
 *
 * Registered as APP_GUARD in AppModule → protects ALL endpoints.
 * Endpoints with @Public() are automatically excluded.
 * Extracts the Bearer token from the Authorization header and attaches it to the request.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Determines if the request can proceed based on authentication status.
   * Skips authentication for routes marked with @Public().
   *
   * @param context - The execution context containing request details
   * @returns true if access is granted
   * @throws UnauthorizedException when authentication token is missing
   */
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AppRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token de autenticación requerido');
    }

    request.token = token;
    return true;
  }

  /**
   * Extracts the Bearer token from the Authorization header.
   *
   * @param request - The HTTP request object
   * @returns The extracted token if present and valid, undefined otherwise
   */
  private extractToken(request: AppRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

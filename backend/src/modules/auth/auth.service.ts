import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import {
  ReqResLoginAdapter,
  ReqResLoginResponse,
} from './adapter/reqres.adapter';

/**
 * Auth Service
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly reqResLoginAdapter: ReqResLoginAdapter) {}

  /**
   * Authenticates a user against the ReqRes external service.
   * Error mapping (400/401 → UnauthorizedException) is handled by the adapter.
   * The service catches UnauthorizedException to add contextual logging,
   * and wraps any unexpected error as UnauthorizedException to avoid leaking internals.
   */
  async login(dto: LoginDto): Promise<{ token: string }> {
    try {
      const { token }: ReqResLoginResponse =
        await this.reqResLoginAdapter.execute(dto.email, dto.password);

      this.logger.log(`Login exitoso para: ${dto.email}`);
      return { token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.logger.warn(
          `Login fallido para: ${dto.email} — credenciales inválidas`,
        );
        throw error;
      }

      this.logger.error(
        `Error inesperado al autenticar a: ${dto.email}`,
        error instanceof Error ? error.message : String(error),
      );
      throw new UnauthorizedException(
        'Error al autenticar con el servicio externo',
      );
    }
  }
}

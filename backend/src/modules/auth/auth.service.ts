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
   * Authenticates a user with ReqRes external service.
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

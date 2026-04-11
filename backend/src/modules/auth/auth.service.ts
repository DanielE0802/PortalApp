import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';

/**
 * Auth Service
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<{ token: string }> {
    const baseUrl = this.configService.get<string>('REQRES_BASE_URL');
    const apiKey = this.configService.get<string>('REQRES_API_KEY');

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<{ token: string }>(
          `${baseUrl}/login`,
          {
            email: dto.email,
            password: dto.password,
          },
          {
            headers: {
              'x-api-key': apiKey,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log(`Login exitoso para: ${dto.email}`);
      return { token: data.token };
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      const status = axiosError?.response?.status;

      if (status === 400) {
        this.logger.warn(
          `Login fallido para: ${dto.email} — credenciales inválidas`,
        );
        throw new UnauthorizedException('Credenciales inválidas');
      }

      this.logger.error(
        `Error al autenticar con ReqRes para: ${dto.email}`,
        String(error),
      );
      throw new UnauthorizedException(
        'Error al autenticar con el servicio externo',
      );
    }
  }
}

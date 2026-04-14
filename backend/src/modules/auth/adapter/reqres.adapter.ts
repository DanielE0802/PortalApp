import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';

export interface ReqResLoginResponse {
  token: string;
}

@Injectable()
export class ReqResLoginAdapter {
  private readonly logger = new Logger(ReqResLoginAdapter.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly resourcePath: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('reqres.apiKey') ?? '';
    const loginConfig = this.configService.get<{
      baseUrl: string;
      resourcePath: string;
    }>('reqres.login');
    this.baseUrl = loginConfig?.baseUrl ?? '';
    this.resourcePath = loginConfig?.resourcePath ?? '/login';
  }

  async execute(email: string, password: string): Promise<ReqResLoginResponse> {
    const url = `${this.baseUrl}${this.resourcePath}`;

    return firstValueFrom(
      this.httpService
        .post<ReqResLoginResponse>(
          url,
          { email, password },
          {
            headers: {
              'x-api-key': this.apiKey,
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(
          map((res: AxiosResponse<ReqResLoginResponse>) => res.data),
          catchError((error: AxiosError) => {
            const status = error.response?.status;

            if (
              status === HttpStatus.BAD_REQUEST ||
              status === HttpStatus.UNAUTHORIZED
            ) {
              this.logger.warn(
                `[ReqResLoginAdapter] Credenciales inválidas ${email} — status ${status}`,
              );
              throw new UnauthorizedException('Credenciales inválidas');
            }

            this.logger.error(
              `[ReqResLoginAdapter] Error inesperado al conectar con ReqRes — url: ${url}, status: ${status ?? 'sin respuesta'}`,
            );
            throw new InternalServerErrorException(
              'Error al conectar con el servicio de autenticación',
            );
          }),
        ),
    );
  }
}

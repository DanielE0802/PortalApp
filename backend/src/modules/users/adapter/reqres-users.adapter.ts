import { HttpService } from '@nestjs/axios';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';

export interface ReqResRawUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ReqResUserListResponse {
  data: ReqResRawUser[];
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

@Injectable()
export class ReqResUsersAdapter {
  private readonly logger = new Logger(ReqResUsersAdapter.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('reqres.apiKey') ?? '';
    const listConfig = this.configService.get<{
      baseUrl: string;
      resourcePath: string;
    }>('reqres.userList');
    this.baseUrl = `${listConfig?.baseUrl ?? ''}${listConfig?.resourcePath ?? '/users'}`;
  }

  private get headers() {
    return {
      ...(this.apiKey ? { 'x-api-key': this.apiKey } : {}),
      'Content-Type': 'application/json',
    };
  }

  /**
   * Fetches a paginated list of users from the ReqRes API.
   * Maps any failure to InternalServerErrorException.
   */
  async getUserList(page: number): Promise<ReqResUserListResponse> {
    return firstValueFrom(
      this.httpService
        .get<ReqResUserListResponse>(this.baseUrl, {
          params: { page },
          headers: this.headers,
        })
        .pipe(
          map((res: AxiosResponse<ReqResUserListResponse>) => res.data),
          catchError((error: AxiosError) => {
            this.logger.error(
              `[ReqResUsersAdapter] Error fetching user list — status: ${error.response?.status ?? 'no response'}`,
            );
            throw new InternalServerErrorException(
              'Error al obtener usuarios del servicio externo',
            );
          }),
        ),
    );
  }

  /**
   * Fetches a single user by their ReqRes ID.
   */
  async getUserById(reqresId: number): Promise<ReqResRawUser> {
    const url = `${this.baseUrl}/${reqresId}`;

    return firstValueFrom(
      this.httpService
        .get<{ data: ReqResRawUser }>(url, { headers: this.headers })
        .pipe(
          map((res: AxiosResponse<{ data: ReqResRawUser }>) => res.data.data),
          catchError((error: AxiosError) => {
            const status = error.response?.status;

            if (status === HttpStatus.NOT_FOUND) {
              this.logger.warn(
                `[ReqResUsersAdapter] User #${reqresId} not found in ReqRes`,
              );
              throw new NotFoundException(
                `Usuario #${reqresId} no encontrado en ReqRes`,
              );
            }

            this.logger.error(
              `[ReqResUsersAdapter] Error fetching user #${reqresId} — status: ${status ?? 'no response'}`,
            );
            throw new InternalServerErrorException(
              'Error al obtener el usuario del servicio externo',
            );
          }),
        ),
    );
  }
}

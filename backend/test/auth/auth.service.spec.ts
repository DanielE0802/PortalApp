import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../src/modules/auth/auth.service';
import { ReqResLoginAdapter } from '../../src/modules/auth/adapter/reqres.adapter';

describe('AuthService', () => {
  let authService: AuthService;
  let adapter: jest.Mocked<Pick<ReqResLoginAdapter, 'execute'>>;

  beforeEach(async () => {
    adapter = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ReqResLoginAdapter, useValue: adapter },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return token when adapter resolves successfully', async () => {
      adapter.execute.mockResolvedValue({ token: 'QpwL5tpe83ilfN2' });

      const result = await authService.login({
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      });

      expect(result).toEqual({ token: 'QpwL5tpe83ilfN2' });
      expect(adapter.execute).toHaveBeenCalledWith(
        'eve.holt@reqres.in',
        'cityslicka',
      );
    });

    it('should re-throw UnauthorizedException from the adapter (invalid credentials)', async () => {
      adapter.execute.mockRejectedValue(
        new UnauthorizedException('Credenciales inválidas'),
      );

      await expect(
        authService.login({ email: 'bad@email.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should wrap unexpected errors as UnauthorizedException', async () => {
      adapter.execute.mockRejectedValue(
        new InternalServerErrorException('connection error'),
      );

      await expect(
        authService.login({
          email: 'eve.holt@reqres.in',
          password: 'cityslicka',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});

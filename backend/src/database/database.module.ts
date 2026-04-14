import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

/**
 * DatabaseModule centralizes the TypeORM connection setup.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const db = config.get<Record<string, unknown>>('db') ?? {};
        const isProduction = config.get('general.env') === 'production';

        return {
          ...db,
          type: 'postgres' as const,
          entities: [join(__dirname, 'entities', '*.entity{.ts,.js}')],
          migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}

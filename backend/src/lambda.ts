import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import serverlessExpress from '@codegenie/serverless-express';
import type { Handler } from 'aws-lambda';
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters';
import { TransformResponseInterceptor } from './common/interceptors';

/**
 * Lambda handler for AWS.
 *
 */
let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  if (cachedServer) return cachedServer;

  const logger = new Logger('LambdaBootstrap');
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['*'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const configService = app.get(ConfigService);
  const swaggerEnabled = configService.get<boolean>('swagger.enable') ?? false;
  const swaggerPath = configService.get<string>('swagger.path') ?? 'docs';
  const normalizedSwaggerPath = swaggerPath
    .replace(/^\/+|\/+$/g, '')
    .replace(/^api\/v1\//, '');
  const swaggerMountPath = `${globalPrefix}/${normalizedSwaggerPath}`;

  if (swaggerEnabled) {
    const appStage = process.env.APP_STAGE || 'prod';
    const config = new DocumentBuilder()
      .setTitle('PortalApp API')
      .setDescription('User & Posts Management Portal API')
      .setVersion('1.0')
      .addBearerAuth()
      .addServer(`/${appStage}`)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerMountPath, app, document);
    logger.log(`docs enabled at /${swaggerMountPath}`);
  } else {
    logger.log('docs disabled');
  }

  await app.init();
  cachedServer = serverlessExpress({ app: expressApp });
  return cachedServer;
}

export const handler: Handler = async (event, context, callback) => {
  const server = await bootstrap();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return server(event, context, callback);
};

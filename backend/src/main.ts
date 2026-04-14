import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters';
import { TransformResponseInterceptor } from './common/interceptors';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.use(helmet());
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
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
      transformOptions: {
        enableImplicitConversion: true,
      },
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
    const appStage = process.env.APP_STAGE;
    const configBuilder = new DocumentBuilder()
      .setTitle('PortalApp API')
      .setDescription('User & Posts Management Portal API')
      .setVersion('1.0')
      .addBearerAuth();

    if (appStage) {
      configBuilder.addServer(`/${appStage}`);
    }

    const config = configBuilder.build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerMountPath, app, document);
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  if (swaggerEnabled) {
    logger.log(`docs: http://localhost:${port}/${swaggerMountPath}`);
  } else {
    logger.log('docs: disabled');
  }
}

void bootstrap();

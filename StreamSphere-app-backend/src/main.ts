import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as express from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { authTokenMiddleware } from './common/middleware/auth-token.middleware';

async function bootstrap() {
  ['uploads/images', 'uploads/videos'].forEach((dir) => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  // Razorpay webhook needs raw body for signature verification
  app.use('/payments/webhook', express.raw({ type: 'application/json' }));

  // Increase request payload size limit for JSON bodies
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use(authTokenMiddleware);

  // Enable CORS for all origins
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token', 'access-token', 'token'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        const messages = errors.flatMap(err =>
          Object.values(err.constraints || {})
        );

        return new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          errors: messages,
        });
      },
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Streaming App API')
    .setDescription('API documentation for Streaming App Backend')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Users', 'User authentication and management')
    .addTag('Admin', 'Admin registration and login')
    .addTag('Movies', 'Movie management operations')
    .addTag('Movie Categories', 'Movie category management')
    .addTag('File Upload', 'File upload and storage operations')
    .addTag('Watchtime', 'Continue watching and watch progress')
    .addTag('Payments', 'Razorpay subscription payments')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const port = 3000;
  await app.listen(port);
  console.log(`Streaming API running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();

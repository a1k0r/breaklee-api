import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AUTH_TOKEN_HEADER } from './auth/auth.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  if (configService.get('SWAGGER_ENABLED') === 'true') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('breaklee API')
      .setDescription('The breaklee API description')
      .setVersion('1.0')
      .addServer(`http://localhost:${configService.get('API_PORT')}`)
      .addSecurity('token', {
        type: 'apiKey',
        name: AUTH_TOKEN_HEADER,
        in: 'header',
      })
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('openapi', app, document);
  }

  await app.listen(configService.get('API_PORT'));
}
bootstrap();

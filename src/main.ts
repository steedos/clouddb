import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule, setupSwagger } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ 
    forbidUnknownValues: false,
  }));
  app.setGlobalPrefix('v1');
  app.enableCors();

  setupSwagger(app);
  
  await app.listen(3000);
}
bootstrap();

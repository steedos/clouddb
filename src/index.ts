import serverlessExpress from '@vendia/serverless-express';
import { APIGatewayProxyHandler, Handler } from 'aws-lambda';
import express from 'express';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule, setupSwagger } from './app.module';

let cachedServer: Handler;

const bootstrapServer = async (): Promise<Handler> => {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  app.enableCors();

  setupSwagger(app);

  await app.init();
  
  return serverlessExpress({
    app: expressApp,
  });
};

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback,
) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer(event, context, callback);
};

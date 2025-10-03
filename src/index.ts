import * as functions from 'firebase-functions/v1';

import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import express from 'express';

// ----- Triggers -----
export * from '@src/modules/firebase/triggers/onCreate';

const expressServer = express();
const createFunction = async (expressInstance): Promise<void> => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.enableCors();

  await app.init();
};

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '1GB',
};

let nestReady: Promise<void> | null = null;

export const api = functions
  .runWith(runtimeOpts as functions.RuntimeOptions)
  .region('asia-southeast1')
  .https.onRequest(async (request, response) => {
    if (!nestReady) {
      nestReady = createFunction(expressServer);
    }
    await nestReady;
    expressServer(request, response);
  });

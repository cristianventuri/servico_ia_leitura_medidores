import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { PUBLIC_DIR } from './enum/directories.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Ajusta tamanho máximo permitido */
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  const existsDir = await existsSync(PUBLIC_DIR);
  if (!existsDir) {
    await mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  /* Disponibiliza diretório público*/
  app.use('/public', express.static(PUBLIC_DIR));

  await app.listen(80);
}
bootstrap();

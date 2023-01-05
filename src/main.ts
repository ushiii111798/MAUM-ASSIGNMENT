import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { graphqlUploadExpress } from 'graphql-upload';
import { json, urlencoded } from 'express';
import { join } from 'path';

async function bootstrap() {
  const ALLOWED_HOSTS = process.env.ALLOWED_HOSTS.split(',');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(graphqlUploadExpress());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: true }));
  app.useStaticAssets(join(__dirname, '..', 'static'));

  app.enableCors({
    origin: ALLOWED_HOSTS,
    credentials: true,
  });
  await app.listen(Number(process.env.SERVER_PORT));
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
// import { join } from 'path';
import { AppModule } from './app.module';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });
  app.use(json({ limit: '50mb' }));
  app.enableCors();
  app.setGlobalPrefix(process.env.BASE_PATH);
  const config = new DocumentBuilder()
    .setTitle('IMS API Docs')
    .setVersion('1.0')
    .setBasePath(process.env.BASE_PATH)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  SwaggerModule.setup(
    process.env.BASE_PATH + '/explorer',
    app,
    document,
    customOptions,
  );

  await app.listen(+process.env.PORT || 4600);
}
(async () => await bootstrap())();

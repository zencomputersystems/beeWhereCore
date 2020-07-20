import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
require('dotenv').config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true
    }
  ));

  const options = new DocumentBuilder()
    .setTitle('Attendance REST API')
    .setDescription('This is API for attendance service')
    .setVersion('1.0')
    .addTag('attendance')
    .addBearerAuth('Authorization', 'header', 'apiKey')
    .setSchemes("http", "https")
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/docs', app, document);

  let port = process.env.PORT || 3000;
  Logger.log('Program running on port ' + port, 'PORT:' + port);

  await app.listen(port);
}
bootstrap();

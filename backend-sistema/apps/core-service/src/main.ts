import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // <--- Habilita CORS
  await app.listen(3002); // <--- Cambia el puerto a 3002
  console.log(`Core Service corriendo en: ${await app.getUrl()}`);
}
bootstrap();

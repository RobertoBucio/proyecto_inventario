import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // <--- Habilita CORS
  await app.listen(3001); // <--- Cambia el puerto a 3001
  console.log(`Auth Service corriendo en: ${await app.getUrl()}`);
}
bootstrap();

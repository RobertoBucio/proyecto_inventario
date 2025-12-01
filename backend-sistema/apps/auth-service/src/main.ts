import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // "process.env.PORT" es el puerto que Render nos dará
  await app.listen(process.env.PORT || 3001); 
}
bootstrap();

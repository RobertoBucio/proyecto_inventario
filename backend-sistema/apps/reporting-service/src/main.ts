import { NestFactory } from '@nestjs/core';
import { ReportingServiceModule } from './reporting-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ReportingServiceModule);
  await app.listen(process.env.PORT || 3003);
}
bootstrap();

import { Module } from '@nestjs/common';
import { ReportingServiceController } from './reporting-service.controller';
import { ReportingServiceService } from './reporting-service.service';
import { PdfService } from './pdf/pdf.service';
import { EmailService } from './email/email.service';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [],
  controllers: [ReportingServiceController],
  providers: [ReportingServiceService, PdfService, EmailService, TasksService],
})
export class ReportingServiceModule {}

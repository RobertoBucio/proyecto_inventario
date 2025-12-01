import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PdfService } from './pdf/pdf.service';
import { EmailService } from './email/email.service';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Habilita los Cron Jobs
  ],
  controllers: [],
  providers: [PdfService, EmailService, TasksService],
})
export class AppModule {}
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PdfService } from '../pdf/pdf.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService,
  ) {}

  // Se ejecuta cada 30 segundos (SOLO PARA QUE PRUEBES AHORA MISMO)
  // En la vida real usarías: CronExpression.EVERY_WEEK
  @Cron('*/30 * * * * *') 
  async handleCronTest() {
    this.logger.debug('Generando reporte automático de prueba...');

    // 1. Simular datos (en un caso real, aquí llamarías a la base de datos)
    const datosSimulados = {
      periodo: 'PRUEBA RAPIDA (30 seg)',
      totalVentas: 15000,
      cantidadProductos: 45,
      nuevosProductos: 10
    };

    // 2. Generar PDF
    const pdf = await this.pdfService.generarReporte(datosSimulados);

    // 3. Enviar Correo
    // CAMBIA ESTE CORREO POR EL TUYO SI QUIERES
    await this.emailService.enviarReporte('cliente@empresa.com', pdf);
  }

  // Ejemplo de reporte Semanal (Comentado para que no estorbe ahora)
  // @Cron(CronExpression.EVERY_WEEK)
  // handleWeekly() { ... }
}
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // Configuración para pruebas (Ethereal Email)
    // En producción, aquí pondrías tu Gmail o Outlook
    this.createTestAccount();
  }

  async createTestAccount() {
    const testAccount = await nodemailer.createTestAccount();
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  async enviarReporte(destinatario: string, pdfBuffer: Buffer) {
    if (!this.transporter) await this.createTestAccount();

    const info = await this.transporter.sendMail({
      from: '"Sistema Inventario" <no-reply@sistema.com>',
      to: destinatario,
      subject: 'Reporte Automático de Ventas',
      text: 'Adjunto encontrarás el reporte solicitado.',
      attachments: [
        {
          filename: 'reporte_ventas.pdf',
          content: pdfBuffer,
        },
      ],
    });

    console.log('📧 Correo enviado: %s', info.messageId);
    console.log('🔗 Vista previa URL: %s', nodemailer.getTestMessageUrl(info)); // ¡IMPORTANTE!
  }
}
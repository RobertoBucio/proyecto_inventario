import { Injectable } from '@nestjs/common';
// CORRECCIÓN: Quitamos el "* as" para que funcione el constructor
import PDFDocument from 'pdfkit'; 

@Injectable()
export class PdfService {
  async generarReporte(datos: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', (buffer) => buffers.push(buffer));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // --- DISEÑO DEL PDF ---
      doc.fontSize(25).text('Reporte de Inventario y Ventas', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text(`Tipo de Reporte: ${datos.periodo}`);
      doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`);
      doc.moveDown();

      doc.text('--- Resumen de Operaciones ---');
      doc.text(`Total Ventas: $${datos.totalVentas}`);
      doc.text(`Productos Vendidos: ${datos.cantidadProductos}`);
      doc.text(`Nuevos Productos en Inventario: ${datos.nuevosProductos}`);
      
      doc.end();
    });
  }
}
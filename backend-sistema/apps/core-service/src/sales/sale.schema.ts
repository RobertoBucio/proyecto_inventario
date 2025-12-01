import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true }) // Agrega createdAt y updatedAt automático
export class Sale {
  @Prop()
  cliente: string;

  @Prop()
  total: number;

  @Prop()
  items: Array<{ productId: string; cantidad: number; precioUnitario: number }>;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
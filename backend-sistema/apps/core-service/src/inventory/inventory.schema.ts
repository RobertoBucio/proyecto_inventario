import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Inventory extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  precio: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  categoria: string;

  @Prop()
  usuarioEmail: string; // Para saber de quién es el producto
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
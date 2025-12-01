import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  precio: number;

  @Prop({ required: true, min: 0 })
  stock: number; // Cantidad disponible

  @Prop()
  categoria: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
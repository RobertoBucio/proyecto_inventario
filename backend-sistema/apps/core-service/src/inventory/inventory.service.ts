import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async crearProducto(datos: any) {
    const nuevo = new this.productModel(datos); 
    return nuevo.save();
  }

  async listarProductos(email: string) {
    return this.productModel.find({ usuarioEmail: email }).exec();
  }

  // Método auxiliar para actualizar stock (lo usaremos en ventas)
  async actualizarStock(id: string, cantidad: number, session: any) {
      return this.productModel.findByIdAndUpdate(
          id, 
          { $inc: { stock: -cantidad } }, 
          { session, new: true }
      );
  }
}
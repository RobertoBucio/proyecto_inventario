import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Sale, SaleDocument } from './sale.schema';
import { Product, ProductDocument } from '../inventory/product.schema';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectConnection() private connection: Connection, // Necesario para transacciones
  ) {}

  async crearVenta(datosVenta: any) {
    const session = await this.connection.startSession();
    session.startTransaction(); // INICIO DE LA TRANSACCIÓN

    try {
      let totalCalculado = 0;

      // 1. Verificar stock y calcular total
      for (const item of datosVenta.items) {
        const producto = await this.productModel.findById(item.productId).session(session);
        
        if (!producto) throw new BadRequestException(`Producto ${item.productId} no existe`);
        if (producto.stock < item.cantidad) {
            throw new BadRequestException(`Stock insuficiente para ${producto.nombre}`);
        }

        totalCalculado += producto.precio * item.cantidad;

        // 2. Restar Stock (Operación atómica)
        await this.productModel.updateOne(
            { _id: item.productId },
            { $inc: { stock: -item.cantidad } }
        ).session(session);
      }

      // 3. Guardar la venta
      const nuevaVenta = new this.saleModel({
          ...datosVenta,
          total: totalCalculado
      });
      await nuevaVenta.save({ session });

      // 4. Confirmar todo (Si llega aquí, todo se guarda)
      await session.commitTransaction();
      return nuevaVenta;

    } catch (error) {
      // 5. Si algo falla, deshacer todo (Rollback)
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async listarVentas() {
      return this.saleModel.find().exec();
  }
}
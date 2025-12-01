import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Sale, SaleSchema } from './sale.schema';
import { Product, ProductSchema } from '../inventory/product.schema'; // Importamos el schema de producto también

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Sale.name, schema: SaleSchema },
        { name: Product.name, schema: ProductSchema } // Necesitamos acceder a productos
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
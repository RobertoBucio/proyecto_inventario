import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryModule } from './inventory/inventory.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    // PEGA AQUÍ TU STRING DE CONEXIÓN DE ATLAS (Reemplaza <password>)
    MongooseModule.forRoot(
      'mongodb+srv://admin:contraseña@proyectoinventario.kl6ybai.mongodb.net/?appName=proyectoInventario'
    ),
    InventoryModule,
    SalesModule,
  ],
})
export class AppModule {}
// Actualizando core
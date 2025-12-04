import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // <--- OBLIGATORIO
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
// Ajusta esta ruta según donde tengas tu esquema (Caso A o Caso B del paso 1)
import { Inventory, InventorySchema } from './inventory.schema'; 

@Module({
  imports: [
    // ESTA ES LA LÍNEA QUE SALVA AL SERVIDOR DE MORIR:
    MongooseModule.forFeature([{ name: Inventory.name, schema: InventorySchema }]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
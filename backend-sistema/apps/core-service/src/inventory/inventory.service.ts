import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from './inventory.schema'; // Asegúrate que la ruta sea correcta

@Injectable()
export class InventoryService {
  constructor(@InjectModel(Inventory.name) private inventoryModel: Model<Inventory>) {}

  // Crear producto
  async create(createInventoryDto: any): Promise<Inventory> {
    const createdInventory = new this.inventoryModel(createInventoryDto);
    return createdInventory.save();
  }

  // Leer todos los productos
  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel.find().exec();
  }

  // --- ¡ESTA ES LA FUNCIÓN QUE FALTABA PARA BORRAR! ---
  async remove(id: string): Promise<any> {
    return this.inventoryModel.findByIdAndDelete(id).exec();
  }
}
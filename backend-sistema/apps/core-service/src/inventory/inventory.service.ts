// ... imports anteriores
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// Asegúrate de importar tu Schema correctamente (puede ser ./schemas/inventory.schema o ./inventory.schema)
import { Inventory } from './inventory.schema'; 

@Injectable()
export class InventoryService {
  constructor(@InjectModel(Inventory.name) private inventoryModel: Model<Inventory>) {}

  async create(createInventoryDto: any): Promise<Inventory> {
    const createdInventory = new this.inventoryModel(createInventoryDto);
    return createdInventory.save();
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel.find().exec();
  }

  async remove(id: string): Promise<any> {
    return this.inventoryModel.findByIdAndDelete(id).exec();
  }

  // --- ¡NUEVA FUNCIÓN: ACTUALIZAR STOCK! ---
  async update(id: string, updateData: any): Promise<Inventory> {
    // Busca por ID y actualiza solo los datos que enviemos (como el stock)
    return this.inventoryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
}
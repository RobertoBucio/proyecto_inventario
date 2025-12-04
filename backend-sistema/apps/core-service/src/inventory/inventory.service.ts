import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from './inventory.schema'; 

@Injectable()
export class InventoryService {
  constructor(@InjectModel(Inventory.name) private inventoryModel: Model<Inventory>) {}

  // Crear y Leer (Estos ya funcionaban)
  async create(createInventoryDto: any): Promise<Inventory> {
    const createdInventory = new this.inventoryModel(createInventoryDto);
    return createdInventory.save();
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel.find().exec();
  }

  // --- CORRECCIÓN AQUÍ: Usamos "any" para que TypeScript no se queje ---
  
  async remove(id: string): Promise<any> {
    return this.inventoryModel.findByIdAndDelete(id).exec();
  }

  async update(id: string, updateData: any): Promise<any> {
    return this.inventoryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
}
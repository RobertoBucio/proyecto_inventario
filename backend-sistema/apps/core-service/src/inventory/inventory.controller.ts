import { Controller, Get, Post, Body, Delete, Param, Patch } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() createInventoryDto: any) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }

  // --- ¡NUEVO ENDPOINT: RECIBIR ACTUALIZACIÓN! ---
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.inventoryService.update(id, updateData);
  }
}
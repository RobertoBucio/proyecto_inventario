import { Body, Controller, Get, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  crear(@Body() body: any) {
    return this.inventoryService.crearProducto(body);
  }

  @Get()
  listar() {
    return this.inventoryService.listarProductos();
  }
}
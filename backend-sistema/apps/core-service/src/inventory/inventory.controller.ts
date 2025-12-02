import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  crear(@Body() body: any) {
    // El frontend nos enviará el email en el body
    return this.inventoryService.crearProducto(body);
  }

  @Get()
  listar(@Query('email') email: string) { 
    // Leemos el email de la URL (ej: /inventory?email=juan@test.com)
    return this.inventoryService.listarProductos(email);
  }
}
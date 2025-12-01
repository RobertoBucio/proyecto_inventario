import { Body, Controller, Get, Post } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  crearVenta(@Body() body: any) {
    return this.salesService.crearVenta(body);
  }

  @Get()
  verVentas() {
    return this.salesService.listarVentas();
  }
}
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrderDetailsService } from './orderdetails.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private orderDetailsSession: OrderDetailsService) {}

  // Get all order details (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.orderDetailsSession.getAll();
  }

  // Get single order detail by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.orderDetailsSession.findById(+id);
  }

  // Create order detail (open - for demo)
  @Post()
  async create(
    @Body()
    body: {
      order_id: number;
      product_id: number;
      quantity?: number;
    },
  ) {
    return this.orderDetailsSession.createOrderDetail(body);
  }

  // Update order detail (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      order_id?: number;
      product_id?: number;
      quantity?: number;
    },
  ) {
    return this.orderDetailsSession.updateOrderDetail(+id, body);
  }

  // Delete order detail (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orderDetailsSession.deleteOrderDetail(+id);
  }
}
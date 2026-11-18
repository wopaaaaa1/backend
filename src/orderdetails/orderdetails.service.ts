import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class OrderDetailsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrderDetail(data: {
    order_id: number;
    product_id: number;
    quantity?: number;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO order_details (order_id, product_id, quantity) VALUES (?, ?, ?)',
      [data.order_id, data.product_id, data.quantity ?? 1],
    );
    return { order_detail_id: result.insertId, ...data };
  }

  async findByOrderId(order_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_detail_id, order_id, product_id, quantity FROM order_details WHERE order_id = ?',
      [order_id],
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_detail_id, order_id, product_id, quantity FROM order_details WHERE order_detail_id = ?',
      [id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_detail_id, order_id, product_id, quantity FROM order_details',
    );
    return rows;
  }

  async updateOrderDetail(
    id: number,
    partial: {
      order_id?: number;
      product_id?: number;
      quantity?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.order_id !== undefined) {
      fields.push('order_id = ?');
      values.push(partial.order_id);
    }
    if (partial.product_id !== undefined) {
      fields.push('product_id = ?');
      values.push(partial.product_id);
    }
    if (partial.quantity !== undefined) {
      fields.push('quantity = ?');
      values.push(partial.quantity);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE order_details SET ${fields.join(', ')} WHERE order_detail_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deleteOrderDetail(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM order_details WHERE order_detail_id = ?', [id]);
    return res.affectedRows > 0;
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class OrdersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createOrder(data: {
    customer_id: number;
    order_date?: string;
    status?: string;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO orders (customer_id, order_date, status) VALUES (?, COALESCE(?, CURRENT_TIMESTAMP), COALESCE(?, ?))',
      [data.customer_id, data.order_date || null, data.status || null, 'Pending'],
    );
    return { order_id: result.insertId, ...data };
  }

  async findByCustomerId(customer_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, customer_id, order_date, status FROM orders WHERE customer_id = ?',
      [customer_id],
    );
    return rows;
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, customer_id, order_date, status FROM orders WHERE order_id = ?',
      [id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT order_id, customer_id, order_date, status FROM orders',
    );
    return rows;
  }

  async updateOrder(
    id: number,
    partial: {
      customer_id?: number;
      order_date?: string;
      status?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.customer_id !== undefined) {
      fields.push('customer_id = ?');
      values.push(partial.customer_id);
    }
    if (partial.order_date !== undefined) {
      fields.push('order_date = ?');
      values.push(partial.order_date);
    }
    if (partial.status !== undefined) {
      fields.push('status = ?');
      values.push(partial.status);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE orders SET ${fields.join(', ')} WHERE order_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deleteOrder(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM orders WHERE order_id = ?', [id]);
    return res.affectedRows > 0;
  }
}
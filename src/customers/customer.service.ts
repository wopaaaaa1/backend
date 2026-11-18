import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class CustomersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createCustomer(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO customer (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)',
      [data.first_name, data.last_name, data.email, data.phone || null],
    );
    return { customer_id: result.insertId, ...data };
  }

  async findByEmail(email: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT customer_id, first_name, last_name, email, phone FROM customer WHERE email = ?',
      [email],
    );
    return rows[0];
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT customer_id, first_name, last_name, email, phone FROM customer WHERE customer_id = ?',
      [id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT customer_id, first_name, last_name, email, phone FROM customer',
    );
    return rows;
  }

  async updateCustomer(
    id: number,
    partial: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.first_name !== undefined) {
      fields.push('first_name = ?');
      values.push(partial.first_name);
    }
    if (partial.last_name !== undefined) {
      fields.push('last_name = ?');
      values.push(partial.last_name);
    }
    if (partial.email !== undefined) {
      fields.push('email = ?');
      values.push(partial.email);
    }
    if (partial.phone !== undefined) {
      fields.push('phone = ?');
      values.push(partial.phone);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE customer SET ${fields.join(', ')} WHERE customer_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deleteCustomer(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM customer WHERE customer_id = ?', [id]);
    return res.affectedRows > 0;
  }
}
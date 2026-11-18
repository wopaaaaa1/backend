import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class ProductsService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createProduct(data: {
    product_name: string;
    price: number;
    stock?: number;
  }) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO product (product_name, price, stock) VALUES (?, ?, ?)',
      [data.product_name, data.price, data.stock ?? 0],
    );
    return { product_id: result.insertId, ...data };
  }

  async findByName(product_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, product_name, price, stock FROM product WHERE product_name = ?',
      [product_name],
    );
    return rows[0];
  }

  async findById(id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, product_name, price, stock FROM product WHERE product_id = ?',
      [id],
    );
    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT product_id, product_name, price, stock FROM product',
    );
    return rows;
  }

  async updateProduct(
    id: number,
    partial: {
      product_name?: string;
      price?: number;
      stock?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.product_name !== undefined) {
      fields.push('product_name = ?');
      values.push(partial.product_name);
    }
    if (partial.price !== undefined) {
      fields.push('price = ?');
      values.push(partial.price);
    }
    if (partial.stock !== undefined) {
      fields.push('stock = ?');
      values.push(partial.stock);
    }

    if (fields.length === 0) return await this.findById(id);

    values.push(id);
    const sql = `UPDATE product SET ${fields.join(', ')} WHERE product_id = ?`;
    await this.pool().execute(sql, values);
    return this.findById(id);
  }

  async deleteProduct(id: number) {
    const [res] = await this.pool().execute<OkPacket>('DELETE FROM product WHERE product_id = ?', [id]);
    return res.affectedRows > 0;
  }
}
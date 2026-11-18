import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { CustomersModule } from './customers/customer.module';
import { ProductsModule } from './products/product.module';
import { OrdersModule } from './orders/order.module';
import { OrderDetailsModule } from './orderdetails/orderdetails.module';

 @Module({
   imports: [DatabaseModule, UsersModule, AuthModule, CustomersModule, ProductsModule, OrdersModule, OrderDetailsModule],
 })

export class AppModule {}
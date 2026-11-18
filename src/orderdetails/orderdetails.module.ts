import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OrderDetailsService } from './orderdetails.service';
import { OrderDetailsController } from './orderdetails.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService],
  exports: [OrderDetailsService],
})
export class OrderDetailsModule {}
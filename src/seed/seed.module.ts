import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { CategoriesModule } from '../categories/categories.module';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { TerminalsModule } from '../terminals/terminals.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { TablesModule } from '../tables/tables.module';
import { SalesModule } from '../sales/sales.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../sales/entities/sale.entity';
import { SaleDetail } from '../sales/entities/sale-detail.entity';
import { Table } from '../tables/entities/table.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';

@Module({
  imports: [
    ProductsModule, 
    UsersModule, 
    RolesModule,
    CategoriesModule,
    PaymentMethodsModule,
    TerminalsModule,
    RestaurantsModule,
    TablesModule,
    SalesModule,
    TypeOrmModule.forFeature([
      Sale, 
      SaleDetail, 
      Table, 
      User, 
      Product, 
      Restaurant, 
      PaymentMethod
    ])
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule { }

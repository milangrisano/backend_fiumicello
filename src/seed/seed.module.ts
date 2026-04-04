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

@Module({
  imports: [
    ProductsModule, 
    UsersModule, 
    RolesModule,
    CategoriesModule,
    PaymentMethodsModule,
    TerminalsModule,
    RestaurantsModule
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule { }

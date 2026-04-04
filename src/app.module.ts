import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { TablesModule } from './tables/tables.module';
import { SalesModule } from './sales/sales.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { TerminalsModule } from './terminals/terminals.module';
import { SeedModule } from './seed/seed.module';
import { CategoriesModule } from './categories/categories.module';

const importsArr: any[] = [
  ConfigModule.forRoot(),

  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'FiumicelloDB',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'MySecr3tPassWord',
    autoLoadEntities: true,
    synchronize: true, // development only
    //NOTA: En producción usar synchronize: false y generar por defecto el Super Admin como el usuario con todos los privilegios y colocarlo en .env
  }),
  AuthModule,
  UsersModule,
  ProductsModule,
  RestaurantsModule,
  TablesModule,
  SalesModule,
  PaymentMethodsModule,
  TerminalsModule,
  CategoriesModule,
];

// Load SeedModule only in non-production environments
if (process.env.NODE_ENV !== 'production') {
  importsArr.push(SeedModule);
}

@Module({
  imports: importsArr,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

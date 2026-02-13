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

@Module({
  imports: [
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
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    RestaurantsModule,
    TablesModule,
    SalesModule,
    PaymentMethodsModule,
    TerminalsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

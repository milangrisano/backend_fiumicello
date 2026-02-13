import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethod } from './entities/payment-method.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentMethod]),
        AuthModule,
    ],
    controllers: [PaymentMethodsController],
    providers: [PaymentMethodsService],
    exports: [PaymentMethodsService],
})
export class PaymentMethodsModule { }

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
    constructor(
        @InjectRepository(PaymentMethod)
        private readonly paymentMethodRepository: Repository<PaymentMethod>,
    ) { }

    async create(createPaymentMethodDto: CreatePaymentMethodDto) {
        const paymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);
        return this.paymentMethodRepository.save(paymentMethod);
    }

    findAll() {
        return this.paymentMethodRepository.find({
            where: { isActive: true } // Default to active? Or all? Usually admins want to see all.
            // For now, returning all for CRUD management.
        });
    }

    async findOne(id: number) {
        const paymentMethod = await this.paymentMethodRepository.findOneBy({ id });
        if (!paymentMethod) {
            throw new NotFoundException(`Payment method with ID ${id} not found`);
        }
        return paymentMethod;
    }

    async update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
        const paymentMethod = await this.paymentMethodRepository.preload({
            id: id,
            ...updatePaymentMethodDto,
        });

        if (!paymentMethod) {
            throw new NotFoundException(`Payment method with ID ${id} not found`);
        }

        return this.paymentMethodRepository.save(paymentMethod);
    }

    async remove(id: number) {
        // Soft delete reuse isActive approach
        const paymentMethod = await this.findOne(id);
        paymentMethod.isActive = false;
        return this.paymentMethodRepository.save(paymentMethod);
    }
}

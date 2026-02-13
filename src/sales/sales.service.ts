import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AddItemsDto } from './dto/add-items.dto';
import { CloseSaleDto } from './dto/close-sale.dto';
import { Table } from '../tables/entities/table.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { SaleStatus } from './sale-status.enum';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,

        @InjectRepository(SaleDetail)
        private readonly saleDetailRepository: Repository<SaleDetail>,

        @InjectRepository(Table)
        private readonly tableRepository: Repository<Table>,

        @InjectRepository(Restaurant)
        private readonly restaurantRepository: Repository<Restaurant>,

        @InjectRepository(PaymentMethod)
        private readonly paymentMethodRepository: Repository<PaymentMethod>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly dataSource: DataSource,
    ) { }

    async create(createSaleDto: CreateSaleDto, reqUser: any) {
        // Fetch full user with restaurant
        const user = await this.userRepository.findOne({
            where: { id: reqUser.userId },
            relations: ['restaurant']
        });

        if (!user) throw new NotFoundException('User not found');

        const { tableId } = createSaleDto;

        // 1. Validate User's Restaurant
        if (!user.restaurant) {
            throw new BadRequestException('User is not assigned to any restaurant');
        }

        // 2. Validate Table
        const table = await this.tableRepository.findOne({
            where: { id: tableId },
            relations: ['restaurant']
        });

        if (!table) throw new NotFoundException('Table not found');
        if (!table.isActive) throw new BadRequestException('Table is inactive');
        if (table.restaurant.id !== user.restaurant.id) {
            throw new BadRequestException('Table does not belong to your restaurant');
        }

        // 3. Check if Table is already open
        const existingOpenSale = await this.saleRepository.findOne({
            where: {
                table: { id: tableId },
                status: SaleStatus.OPEN // Use enum for status
            }
        });

        if (existingOpenSale) {
            throw new BadRequestException(`Table ${table.name} is already open with Sale ID ${existingOpenSale.id}`);
        }

        // 4. Create Sale (Open Order)
        const sale = this.saleRepository.create({
            user: user,
            table: table,
            restaurant: user.restaurant,
            status: SaleStatus.OPEN, // Use enum for status
            total: 0,
            details: []
        });

        return this.saleRepository.save(sale);
    }

    async addItems(id: string, addItemsDto: AddItemsDto, reqUser: any) {
        // Fetch full user with restaurant
        const user = await this.userRepository.findOne({
            where: { id: reqUser.userId },
            relations: ['restaurant']
        });

        if (!user) throw new NotFoundException('User not found');

        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: ['restaurant', 'details']
        });

        if (!sale) throw new NotFoundException('Sale not found');
        if (sale.status !== SaleStatus.OPEN) throw new BadRequestException('Sale is not OPEN'); // Use enum for status

        // Ensure user belongs to the same restaurant as the sale?
        // Or if the sale belongs to user's restaurant?
        // Since sale has restaurant, check match.
        if (sale.restaurant.id !== user.restaurant?.id) {
            throw new BadRequestException('Sale does not belong to your restaurant');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let totalAmount = Number(sale.total);

            for (const item of addItemsDto.items) {
                const product = await this.productRepository.findOne({
                    where: { id: item.productId, isActive: true },
                    relations: ['restaurants']
                });

                if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

                // Check if product belongs to restaurant
                const isAvailable = product.restaurants.some(r => r.id === sale.restaurant.id);
                if (!isAvailable) throw new BadRequestException(`Product ${product.type} is not available in this restaurant`);

                const subtotal = Number(product.price) * Number(item.quantity);
                totalAmount += subtotal;

                // Create detail
                const detail = this.saleDetailRepository.create({
                    quantity: item.quantity,
                    price: product.price,
                    subtotal: subtotal,
                    product: product,
                    sale: sale
                });

                await queryRunner.manager.save(detail);
            }

            // Update Sale Total
            sale.total = totalAmount;
            await queryRunner.manager.save(sale);

            await queryRunner.commitTransaction();

            return this.saleRepository.findOne({ where: { id }, relations: ['details', 'details.product'] });

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async close(id: string, closeSaleDto: CloseSaleDto, reqUser: any) {
        // Fetch full user with restaurant (optional if we just want to verify ownership)
        // But let's be consistent
        const user = await this.userRepository.findOne({
            where: { id: reqUser.userId },
            relations: ['restaurant']
        });

        if (!user) throw new NotFoundException('User not found');

        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: ['restaurant']
        });

        if (!sale) throw new NotFoundException('Sale not found');
        if (sale.status !== SaleStatus.OPEN) throw new BadRequestException('Sale is not OPEN'); // Use enum for status

        // Verify ownership/permission
        if (sale.restaurant.id !== user.restaurant?.id) {
            throw new BadRequestException('Sale does not belong to your restaurant');
        }

        const paymentMethod = await this.paymentMethodRepository.findOneBy({ id: closeSaleDto.paymentMethodId, isActive: true });
        if (!paymentMethod) throw new NotFoundException('Payment Method not found');

        sale.paymentMethod = paymentMethod;
        sale.dinerName = closeSaleDto.dinerName || '';
        sale.dinerEmail = closeSaleDto.dinerEmail || '';
        sale.dinerPhone = closeSaleDto.dinerPhone || '';
        sale.status = SaleStatus.CLOSED; // Mark as COMPLETED/CLOSED

        return this.saleRepository.save(sale);
    }

    findAll() {
        return this.saleRepository.find({
            order: { createdAt: 'DESC' }
        });
    }

    findOne(id: string) {
        return this.saleRepository.findOne({ where: { id } });
    }
}

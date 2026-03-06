import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { SaleDetail } from './entities/sale-detail.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AddItemsDto } from './dto/add-items.dto';
import { CloseSaleDto } from './dto/close-sale.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
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
        if (sale.status === SaleStatus.CLOSED || sale.status === SaleStatus.CANCELLED) throw new BadRequestException('Sale is closed or cancelled');

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
            relations: ['restaurant', 'role']
        });

        if (!user) throw new NotFoundException('User not found');

        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: ['restaurant']
        });

        if (!sale) throw new NotFoundException('Sale not found');
        if (sale.status === SaleStatus.CLOSED || sale.status === SaleStatus.CANCELLED) throw new BadRequestException('Sale is already closed or cancelled');

        // Verify ownership/permission
        if (sale.restaurant.id !== user.restaurant?.id) {
            throw new BadRequestException('Sale does not belong to your restaurant');
        }

        const paymentMethod = await this.paymentMethodRepository.findOneBy({ id: closeSaleDto.paymentMethodId, isActive: true });
        if (!paymentMethod) throw new NotFoundException('Payment Method not found');

        // Business Rule: Waiters cannot receive Cash
        const isCash = paymentMethod.name.toLowerCase().includes('efectivo') || paymentMethod.name.toLowerCase().includes('cash');
        if (user.role?.name === 'Waiter' && isCash) {
            throw new BadRequestException('Waiters are not allowed to process cash payments');
        }

        sale.paymentMethod = paymentMethod;
        sale.dinerName = closeSaleDto.dinerName || '';
        sale.dinerEmail = closeSaleDto.dinerEmail || '';
        sale.dinerPhone = closeSaleDto.dinerPhone || '';
        sale.invoiceType = closeSaleDto.invoiceType;
        sale.status = SaleStatus.CLOSED; // Mark as COMPLETED/CLOSED

        return this.saleRepository.save(sale);
    }

    async updateStatus(id: string, updateSaleStatusDto: UpdateSaleStatusDto, reqUser: any) {
        const user = await this.userRepository.findOne({
            where: { id: reqUser.userId },
            relations: ['restaurant', 'role']
        });

        if (!user) throw new NotFoundException('User not found');

        const sale = await this.saleRepository.findOne({
            where: { id },
            relations: ['restaurant']
        });

        if (!sale) throw new NotFoundException('Sale not found');

        // Business Rule: Chef can only update status forward
        if (user.role?.name === 'Chef') {
            const allowedTransitions = [SaleStatus.COMMANDED, SaleStatus.IN_PROGRESS, SaleStatus.READY];
            if (!allowedTransitions.includes(updateSaleStatusDto.status)) {
                throw new BadRequestException('Chefs can only transition to COMMANDED, IN_PROGRESS, or READY');
            }
        }

        sale.status = updateSaleStatusDto.status;
        return this.saleRepository.save(sale);
    }

    private stripPricesForChef(sale: Sale): Sale {
        sale.total = 0;
        if (sale.details) {
            sale.details.forEach(detail => {
                detail.price = 0;
                detail.subtotal = 0;
            });
        }
        return sale;
    }

    async findAll(reqUser: any) {
        const sales = await this.saleRepository.find({
            order: { createdAt: 'DESC' }
        });

        // Strip prices if role is Chef
        if (reqUser?.role === 'Chef') {
            return sales.map(sale => this.stripPricesForChef(sale));
        }

        return sales;
    }

    async findOne(id: string, reqUser?: any) {
        const sale = await this.saleRepository.findOne({ where: { id } });

        if (!sale) throw new NotFoundException('Sale not found');

        if (reqUser?.role === 'Chef') {
            return this.stripPricesForChef(sale);
        }

        return sale;
    }
}

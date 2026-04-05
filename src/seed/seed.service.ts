import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { CategoriesService } from '../categories/categories.service';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { TerminalsService } from '../terminals/terminals.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { TablesService } from '../tables/tables.service';
import { Sale } from '../sales/entities/sale.entity';
import { SaleDetail } from '../sales/entities/sale-detail.entity';
import { Table } from '../tables/entities/table.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
    constructor(
        private readonly productsService: ProductsService,
        private readonly usersService: UsersService,
        private readonly rolesService: RolesService,
        private readonly categoriesService: CategoriesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly terminalsService: TerminalsService,
        private readonly restaurantsService: RestaurantsService,
        private readonly tablesService: TablesService,

        @InjectRepository(Sale)
        private readonly saleRepository: Repository<Sale>,

        @InjectRepository(SaleDetail)
        private readonly saleDetailRepository: Repository<SaleDetail>,

        @InjectRepository(Table)
        private readonly tableRepository: Repository<Table>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Restaurant)
        private readonly restaurantRepository: Repository<Restaurant>,

        @InjectRepository(PaymentMethod)
        private readonly paymentMethodRepository: Repository<PaymentMethod>,

        private readonly dataSource: DataSource,
    ) { }

    async runSeed() {
        await this.deleteTables();
        await this.insertRoles();
        await this.insertCategories();
        await this.insertPaymentMethods();
        await this.insertTerminals();
        await this.insertRestaurants();
        await this.insertNewProducts();
        await this.insertUsers();
        await this.insertTables();
        await this.insertSales();
        return 'Seed executed successfully';
    }

    private async deleteTables() {
        console.log('Deleting previous data...');
        // Order matters for FK constraints
        await this.saleDetailRepository.createQueryBuilder().delete().where({}).execute();
        await this.saleRepository.createQueryBuilder().delete().where({}).execute();
        await this.tableRepository.createQueryBuilder().delete().where({}).execute();
        await this.usersService.deleteAllUsers();
        await this.productsService.deleteAllProducts();
        await this.rolesService.deleteAllRoles();
        await this.categoriesService.deleteAllCategories();
        await this.paymentMethodsService.deleteAllPaymentMethods();
        await this.terminalsService.deleteAllTerminals();
        await this.restaurantsService.deleteAllRestaurants();
        console.log('Previous data deleted.');
    }

    private async insertRoles() {
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { roles: rolesToSeed } = JSON.parse(rawData);

        if (!rolesToSeed) return;

        for (const roleDto of rolesToSeed) {
            const exists = await this.rolesService.findByName(roleDto.name);
            if (!exists) {
                await this.rolesService.create(roleDto);
                console.log(`Seeded role: ${roleDto.name}`);
            }
        }
    }

    private async insertCategories() {
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { categories } = JSON.parse(rawData);

        if (!categories) return;

        const existing = await this.categoriesService.findAll();
        for (const item of categories) {
            if (!existing.find(e => e.name === item.name)) {
                await this.categoriesService.create(item);
                console.log(`Seeded category: ${item.name}`);
            }
        }
    }

    private async insertPaymentMethods() {
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { paymentMethods } = JSON.parse(rawData);

        if (!paymentMethods) return;

        const existing = await this.paymentMethodsService.findAll();
        for (const item of paymentMethods) {
            if (!existing.find(e => e.name === item.name)) {
                await this.paymentMethodsService.create(item);
                console.log(`Seeded payment method: ${item.name}`);
            }
        }
    }

    private async insertTerminals() {
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { terminals } = JSON.parse(rawData);

        if (!terminals) return;

        const existing = await this.terminalsService.findAll();
        for (const item of terminals) {
            if (!existing.find(e => e.name === item.name)) {
                await this.terminalsService.create(item);
                console.log(`Seeded terminal: ${item.name}`);
            }
        }
    }

    private async insertRestaurants() {
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { restaurants } = JSON.parse(rawData);

        if (!restaurants) return;

        const existing = await this.restaurantsService.findAll();
        for (const item of restaurants) {
            if (!existing.find(e => e.name === item.name)) {
                await this.restaurantsService.create(item);
                console.log(`Seeded restaurant: ${item.name}`);
            }
        }
    }

    private async insertNewProducts() {
        const categories = await this.categoriesService.findAll();
        const restaurants = await this.restaurantsService.findAll();
        
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { pizzas, lasagnas, paninis, bebidas } = JSON.parse(rawData);

        const seedProducts: any[] = [];

        let restaurantIndex = 0;
        const getNextRestaurantId = () => {
            if (restaurants.length === 0) return undefined;
            const id = restaurants[restaurantIndex % restaurants.length].id;
            restaurantIndex++;
            return id;
        };

        if (pizzas) {
            for (const p of pizzas) {
                const category = categories.find(c => c.name === p.category);
                const targetRestaurantId = getNextRestaurantId();
                for (const [size, price] of Object.entries(p.prices)) {
                    seedProducts.push({
                        name: p.name,
                        categoryId: category?.id,
                        type: size,
                        description: p.description,
                        price: price,
                        isActive: true,
                        availability: true,
                        restaurantId: targetRestaurantId
                    });
                }
            }
        }

        if (lasagnas) {
            for (const item of lasagnas) {
                const category = categories.find(c => c.name === item.category);
                seedProducts.push({
                    name: item.name,
                    categoryId: category?.id,
                    type: item.type,
                    description: item.description || '',
                    price: item.price,
                    isActive: true,
                    availability: true,
                    restaurantId: getNextRestaurantId()
                });
            }
        }

        if (paninis) {
            for (const item of paninis) {
                const category = categories.find(c => c.name === item.category);
                seedProducts.push({
                    name: item.name,
                    categoryId: category?.id,
                    type: item.type,
                    description: item.description || '',
                    price: item.price,
                    isActive: true,
                    availability: true,
                    restaurantId: getNextRestaurantId()
                });
            }
        }

        if (bebidas) {
            for (const item of bebidas) {
                const category = categories.find(c => c.name === item.category);
                seedProducts.push({
                    name: item.name,
                    categoryId: category?.id,
                    type: item.type,
                    description: item.description || '',
                    price: item.price,
                    isActive: true,
                    availability: true,
                    restaurantId: getNextRestaurantId()
                });
            }
        }

        for (const product of seedProducts) {
            if (product.categoryId) {
                await this.productsService.create(product);
            }
        }
        console.log('Seeded products.');
    }

    private async insertUsers() {
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { users: usersToSeed } = JSON.parse(rawData);

        if (!usersToSeed) return;

        const restaurants = await this.restaurantsService.findAll();

        for (const user of usersToSeed) {
            try {
                const role = await this.rolesService.findByName(user.roleName);
                let roleId: number | undefined;
                if (role) roleId = role.id;

                let restaurantId: string | undefined;
                if (user.restaurantName) {
                    const restaurant = restaurants.find(r => r.name === user.restaurantName);
                    if (restaurant) restaurantId = restaurant.id;
                }

                const { roleName, restaurantName, ...userData } = user;

                await this.usersService.create({ 
                    ...userData, 
                    roleId,
                    restaurantId
                } as any);
                console.log(`Seeded user: ${user.email} (Role: ${user.roleName})`);
            } catch (error) {
                console.error(`Error seeding user ${user.email}:`, error);
            }
        }
    }

    private async insertTables() {
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { tables } = JSON.parse(rawData);

        if (!tables) return;

        const restaurants = await this.restaurantsService.findAll();

        for (const tableDto of tables) {
            const restaurant = restaurants.find(r => r.name === tableDto.restaurantName);
            if (restaurant) {
                await this.tablesService.create({
                    name: tableDto.name,
                    restaurantId: restaurant.id
                });
                console.log(`Seeded table: ${tableDto.name} for restaurant: ${restaurant.name}`);
            }
        }
    }

    private async insertSales() {
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { sales } = JSON.parse(rawData);

        if (!sales) return;

        for (const saleDto of sales) {
            try {
                const restaurant = await this.restaurantRepository.findOneBy({ name: saleDto.restaurantName });
                const table = await this.tableRepository.findOne({
                    where: { name: saleDto.tableName, restaurant: { id: restaurant?.id } }
                });
                const user = await this.userRepository.findOneBy({ email: saleDto.userEmail });
                const paymentMethod = await this.paymentMethodRepository.findOneBy({ name: saleDto.paymentMethodName });

                if (!restaurant || !table || !user) {
                    console.warn(`Missing data for sale seeding: restaurant=${saleDto.restaurantName}, table=${saleDto.tableName}, user=${saleDto.userEmail}`);
                    continue;
                }

                const saleEntity = this.saleRepository.create({
                    dinerName: saleDto.dinerName,
                    dinerEmail: saleDto.dinerEmail,
                    restaurant: restaurant,
                    table: table,
                    user: user,
                    paymentMethod: paymentMethod || undefined,
                    status: saleDto.status,
                    total: 0,
                });

                const savedSale = await this.saleRepository.save(saleEntity);
                let total = 0;

                for (const item of saleDto.items) {
                    const product = await this.productRepository.findOne({
                        where: { name: item.productName, type: item.productType, restaurant: { id: restaurant.id } }
                    });

                    if (product) {
                        const subtotal = Number(product.price) * item.quantity;
                        total += subtotal;

                        const detail = this.saleDetailRepository.create({
                            product: product,
                            quantity: item.quantity,
                            price: product.price,
                            subtotal: subtotal,
                            sale: savedSale
                        });
                        await this.saleDetailRepository.save(detail);
                    } else {
                        console.warn(`Product not found for sale item: ${item.productName} (${item.productType}) in restaurant ${restaurant.name}`);
                    }
                }

                savedSale.total = total;
                await this.saleRepository.save(savedSale);
                console.log(`Seeded sale for ${saleDto.dinerName} - Total: ${total}`);
            } catch (error) {
                console.error('Error seeding sale:', error);
            }
        }
    }
}

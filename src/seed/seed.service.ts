import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { CategoriesService } from '../categories/categories.service';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { TerminalsService } from '../terminals/terminals.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
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
        return 'Seed executed successfully';
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

    private async deleteTables() {
        console.log('Deleting previous data...');
        await this.usersService.deleteAllUsers();
        await this.productsService.deleteAllProducts();
        await this.rolesService.deleteAllRoles();
        await this.categoriesService.deleteAllCategories();
        await this.paymentMethodsService.deleteAllPaymentMethods();
        await this.terminalsService.deleteAllTerminals();
        await this.restaurantsService.deleteAllRestaurants();
        console.log('Previous data deleted.');
    }

    private async insertNewProducts() {
        const categories = await this.categoriesService.findAll();
        const restaurants = await this.restaurantsService.findAll();
        
        let defaultRestaurantId;
        if (restaurants.length > 0) {
            defaultRestaurantId = restaurants[0].id;
        }

        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { pizzas, lasagnas, paninis, bebidas } = JSON.parse(rawData);

        const seedProducts: any[] = [];

        // Repartir equitativamente el catálogo entre los distintos restaurantes
        let restaurantIndex = 0;
        const getNextRestaurantId = () => {
            if (restaurants.length === 0) return undefined;
            const id = restaurants[restaurantIndex % restaurants.length].id;
            restaurantIndex++;
            return id;
        };

        // Format Pizzas
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

        // Add others
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

        const insertPromises: Promise<any>[] = [];
        for (const product of seedProducts) {
            if (product.categoryId) {
                insertPromises.push(this.productsService.create(product));
            } else {
                console.warn(`Category not found for product: ${product.name}, category expected: ${product.category}`);
            }
        }

        await Promise.all(insertPromises);
        console.log('Seeded products.');
    }

    private async insertUsers() {
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { users: usersToSeed } = JSON.parse(rawData);

        if (!usersToSeed) return;

        const restaurants = await this.restaurantsService.findAll();
        let defaultRestaurantId;
        if (restaurants.length > 0) {
            defaultRestaurantId = restaurants[0].id;
        }

        for (const user of usersToSeed) {
            try {
                // Get the role by name directly
                const role = await this.rolesService.findByName(user.roleName);
                let roleId: number | undefined;
                let restaurantId: string | undefined;

                if (role) {
                    roleId = role.id;
                    // Assign default restaurant to everyone to avoid N/A in the interface
                    restaurantId = defaultRestaurantId;
                }

                // create() expects CreateUserDto
                const { roleName, ...userData } = user;

                await this.usersService.create({ 
                    ...userData, 
                    roleId,
                    restaurantId 
                } as any);
                console.log(`Seeded user: ${user.email} (Role: ${user.roleName}, Restaurant: ${restaurantId ? 'Assigned' : 'None'})`);
            } catch (error) {
                console.error(`Error seeding user ${user.email}:`, error);
            }
        }
    }
}
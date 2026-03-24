import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
    constructor(
        private readonly productsService: ProductsService,
        private readonly usersService: UsersService,
        private readonly rolesService: RolesService,
    ) { }

    async runSeed() {
        await this.deleteTables();
        await this.insertRoles();
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

    private async deleteTables() {
        await this.usersService.deleteAllUsers();
        await this.productsService.deleteAllProducts();
    }

    private async insertNewProducts() {
        const products = this.getSeedData();
        const insertPromises: Promise<any>[] = [];

        for (const product of products) {
            insertPromises.push(this.productsService.create(product));
        }

        await Promise.all(insertPromises);
    }

    private async insertUsers() {
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { users: usersToSeed } = JSON.parse(rawData);

        if (!usersToSeed) return;

        for (const user of usersToSeed) {
            try {
                // Get the role by name directly
                const role = await this.rolesService.findByName(user.roleName);
                let roleId: number | undefined;
                if (role) {
                    roleId = role.id;
                }

                // create() expects CreateUserDto
                const { roleName, ...userData } = user;

                await this.usersService.create({ ...userData, roleId } as any);
                console.log(`Seeded user: ${user.email}`);
            } catch (error) {
                console.error(`Error seeding user ${user.email}:`, error);
            }
        }
    }

    private getSeedData(): any[] {
        const dataPath = path.join(__dirname, 'data', 'seed-data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const { pizzas, lasagnas, paninis, bebidas } = JSON.parse(rawData);

        const seedProducts: any[] = [];

        // Format Pizzas
        for (const p of pizzas) {
            for (const [size, price] of Object.entries(p.prices)) {
                seedProducts.push({
                    name: p.name,
                    category: p.category,
                    type: size,
                    description: p.description,
                    price: price,
                    isActive: true,
                    availability: true
                });
            }
        }

        // Add others
        for (const item of [...lasagnas, ...paninis, ...bebidas]) {
            seedProducts.push({
                name: item.name,
                category: item.category,
                type: item.type,
                description: item.description || '',
                price: item.price,
                isActive: true,
                availability: true
            });
        }

        return seedProducts;
    }
}
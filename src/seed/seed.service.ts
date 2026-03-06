import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
    constructor(private readonly productsService: ProductsService) { }

    async runSeed() {
        await this.deleteTables();
        await this.insertNewProducts();
        return 'Seed executed successfully';
    }

    private async deleteTables() {
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
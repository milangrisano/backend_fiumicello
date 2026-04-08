import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>,
    ) { }

    async create(createProductDto: CreateProductDto) {
        const { images = [], restaurantId, categoryId, ...productDetails } = createProductDto;

        const product = this.productRepository.create({
            ...productDetails,
            category: categoryId ? { id: categoryId } as any : undefined,
            restaurant: restaurantId ? { id: restaurantId } as any : undefined,
            images: images.map((image) =>
                this.productImageRepository.create({ url: image.url, name: image.name }),
            ),
        });

        await this.productRepository.save(product);

        return { ...product, images };
    }

    async findAll(user?: any, filterRestaurantId?: string) {
        // Build the where condition based on user roles
        let whereCondition: any = {};
        
        if (user) {
            // El JWT inyecta 'role' como string plano, no como objeto
            const isAgnosticRole = user.role === 'Super Admin' || user.role === 'Admin';
            if (!isAgnosticRole && user.restaurant?.id) {
                // If not an admin/super admin, force filter to their own restaurant
                whereCondition.restaurant = { id: user.restaurant.id };
            } else if (isAgnosticRole && filterRestaurantId) {
                // If admin/super admin AND they requested a specific restaurant filter
                whereCondition.restaurant = { id: filterRestaurantId };
            }
        }

        const products = await this.productRepository.find({
            where: whereCondition,
            relations: {
                images: true,
                restaurant: true,
                category: true,
            },
        });

        return products.map((product) => ({
            ...product,
            images: (product.images || []).map((img) => img.url),
        }));
    }

    async findOne(term: string) {
        let product: Product | null;

        if (isUUID(term)) {
            product = await this.productRepository.findOneBy({ id: term });
        } else {
            // Search by slug or type/name
            const queryBuilder = this.productRepository.createQueryBuilder('prod');
            product = await queryBuilder
                .where('(prod.type =:type or prod.slug =:slug) AND prod.isActive = :isActive', {
                    type: term,
                    slug: term,
                    isActive: true,
                })
                .leftJoinAndSelect('prod.images', 'prodImages')
                .getOne();
        }

        if (!product || !product.isActive)
            throw new NotFoundException(`Product with id, name or slug "${term}" not found`);

        return product;
    }

    async deactivate(id: string) {
        const product = await this.findOne(id);
        product.isActive = false;
        await this.productRepository.save(product);
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const { images, restaurantId, categoryId, ...toUpdate } = updateProductDto;

        const product = await this.productRepository.preload({
            id,
            ...toUpdate,
            category: categoryId ? { id: categoryId } as any : undefined,
            restaurant: restaurantId ? { id: restaurantId } as any : undefined,
        });

        if (!product)
            throw new NotFoundException(`Product with id: ${id} not found`);

        // Create query runner for transaction if updating images
        // For simplicity, assuming full replace of images if provided or append?
        // The requirement says "one to many".
        // If images are provided, we delete old ones and insert new ones? Or append?
        // Let's assume replace strategy for simplicity unless specified.

        if (images) {
            // This part requires a transaction runner ideally or just separate operations
            // Deleting old images
            await this.productImageRepository.delete({ product: { id } });

            // Creating new ones
            product.images = images.map(img => this.productImageRepository.create({ url: img.url, name: img.name }));
        }

        await this.productRepository.save(product);
        return this.findOne(id);
    }

    async deleteAllProducts() {
        const query = this.productRepository.createQueryBuilder('product');

        try {
            return await query
                .delete()
                .where({})
                .execute();
        } catch (error) {
            this.handleDBExceptions(error);
        }
    }

    private handleDBExceptions(error: any) {
        throw new Error(`Unexpected error, check server logs: ${error.message}`);
    }
}

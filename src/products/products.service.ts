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
        const { images = [], restaurantIds, ...productDetails } = createProductDto;

        const product = this.productRepository.create({
            ...productDetails,
            images: images.map((image) =>
                this.productImageRepository.create({ url: image.url, name: image.name }),
            ),
        });

        if (restaurantIds && restaurantIds.length > 0) {
            // Need to load restaurants. For now, simple object with ID is enough for TypeORM if logic permits
            // Or inject RestaurantRepository.
            product.restaurants = restaurantIds.map(id => ({ id } as any));
        }

        await this.productRepository.save(product);

        return { ...product, images };
    }

    async findAll() {
        // Only return active products (soft delete handled automatically by TypeORM if explicitly enabled, but here softDelete is manual?)
        // Actually @DeleteDateColumn handles it automatically for find methods.
        const products = await this.productRepository.find({
            relations: {
                images: true,
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
                .where('prod.type =:type or prod.slug =:slug', {
                    type: term,
                    slug: term,
                })
                .leftJoinAndSelect('prod.images', 'prodImages')
                .getOne();
        }

        if (!product)
            throw new NotFoundException(`Product with id, name or slug "${term}" not found`);

        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        const { images, ...toUpdate } = updateProductDto;

        const product = await this.productRepository.preload({
            id,
            ...toUpdate,
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


}

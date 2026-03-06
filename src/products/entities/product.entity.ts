import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './product-image.entity'; // Import check
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity()
export class Product {
    @ApiProperty({ description: 'The unique UUID of the product', example: '123e4567-e89b-12d3-a456-426614174000' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Target identifier/name of the product', example: 'Pizza Margarita' })
    @Column('text')
    name: string; // The Name of the product

    @ApiProperty({ description: 'Type or variant of the product (e.g., Grande, Mediana, Personal)', example: 'Grande' })
    @Column('text')
    type: string; // The Size or specific variant

    @ApiProperty({ description: 'Category of the product', example: 'Pizzas' })
    @Column('text')
    category: string; // Pizzas, Pastas, Bebidas, Lasagnas, Paninis

    @ApiProperty({ description: 'Detailed description of the product', required: false })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({ description: 'Price of the product', example: 12.5 })
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({ description: 'Availability status of the product', default: true })
    @Column('boolean', {
        default: true
    })
    availability: boolean;

    @ApiProperty({ description: 'Images associated with the product', type: () => [ProductImage], required: false })
    @OneToMany(
        () => ProductImage,
        (productImage: ProductImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ApiProperty({ description: 'Restaurants where this product is available', type: () => [Restaurant] })
    @ManyToMany(() => Restaurant, { eager: true })
    @JoinTable({ name: 'products_restaurants' })
    restaurants: Restaurant[];

    @ApiProperty({ description: 'Date of creation' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Date of last update' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: 'Active status', default: true })
    @Column('boolean', {
        default: true
    })
    isActive: boolean;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ProductImage } from './product-image.entity'; // Import check
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    type: string; // "Tipo" from requirements (Name of the product)

    @Column('text')
    category: string; // Pizzas, Pastas, Bebidas, Lasagnas, Paninis

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column('float', {
        default: 0
    })
    price: number;

    @Column('boolean', {
        default: true
    })
    availability: boolean;

    @OneToMany(
        () => ProductImage,
        (productImage: ProductImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[];

    @ManyToMany(() => Restaurant)
    @JoinTable({ name: 'products_restaurants' })
    restaurants: Restaurant[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('boolean', {
        default: true
    })
    isActive: boolean;
}

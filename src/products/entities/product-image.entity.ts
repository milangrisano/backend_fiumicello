import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class ProductImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    url: string;

    @Column('text', {
        nullable: true
    })
    name: string;

    @ManyToOne(
        () => Product,
        (product: Product) => product.images,
        { onDelete: 'CASCADE' }
    )
    product: Product;
}

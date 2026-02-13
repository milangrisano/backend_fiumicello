import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('sale_details')
export class SaleDetail {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number; // Unit price snapshot

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @ManyToOne(() => Sale, (sale) => sale.details, { onDelete: 'CASCADE' })
    sale: Sale;

    @ManyToOne(() => Product, { eager: true }) // No need for bidirectional in Product unless needed
    product: Product;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Sale } from '../../sales/entities/sale.entity';

@Entity('payment_methods')
export class PaymentMethod {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('text', { unique: true })
    name: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Sale, (sale) => sale.paymentMethod)
    sales: Sale[];
}

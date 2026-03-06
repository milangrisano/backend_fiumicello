import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Sale } from '../../sales/entities/sale.entity';

@Entity('payment_methods')
export class PaymentMethod {
    @ApiProperty({ description: 'The unique identifier of the payment method', example: 1 })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({ description: 'The name of the payment method', example: 'Credit Card' })
    @Column('text', { unique: true })
    name: string;

    @ApiProperty({ description: 'Whether the payment method is active', default: true })
    @Column('boolean', { default: true })
    isActive: boolean;

    @ApiProperty({ description: 'Date of creation' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Date of last update' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: 'Sales using this payment method', type: () => [Sale] })
    @OneToMany(() => Sale, (sale) => sale.paymentMethod)
    sales: Sale[];
}

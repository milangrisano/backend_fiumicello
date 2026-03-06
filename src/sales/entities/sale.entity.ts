import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Terminal } from '../../terminals/entities/terminal.entity';
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity';
import { SaleDetail } from './sale-detail.entity';
import { Table } from '../../tables/entities/table.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { SaleStatus } from '../sale-status.enum';
import { InvoiceType } from '../invoice-type.enum';

@Entity('sales')
export class Sale {
    @ApiProperty({ description: 'The unique UUID of the sale' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Sequential invoice number', example: 1001 })
    @Column('int', { unique: true, generated: 'increment' })
    invoiceNumber: number; // Simple sequential number

    @ApiProperty({ description: 'Total amount of the sale', example: 50.25 })
    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @ApiProperty({ description: 'Status of the sale', enum: SaleStatus, default: SaleStatus.OPEN })
    @Column('text', { default: SaleStatus.OPEN })
    status: string; // OPEN, COMMANDED, IN_PROGRESS, READY, CLOSED, CANCELLED

    @ApiProperty({ description: 'Type of invoice (POS or Electronic)', enum: InvoiceType, required: false })
    @Column({ type: 'text', nullable: true })
    invoiceType: string;

    @ApiProperty({ description: 'Name of the diner', required: false })
    @Column('text', { nullable: true })
    dinerName: string;

    @ApiProperty({ description: 'Email of the diner', required: false })
    @Column('text', { nullable: true })
    dinerEmail: string;

    @ApiProperty({ description: 'Phone of the diner', required: false })
    @Column('text', { nullable: true })
    dinerPhone: string;

    @ApiProperty({ description: 'Date of creation' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Date of last update' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: 'User/waiter who created the sale', type: () => User })
    @ManyToOne(() => User, (user) => user.sales, { eager: true })
    user: User;

    // Terminal is now optional or replaced by Table logic, but we might keep it if "Caja" is different from Table
    @ApiProperty({ description: 'Terminal used for the sale', type: () => Terminal, required: false })
    @ManyToOne(() => Terminal, (terminal) => terminal.sales, { eager: true, nullable: true })
    terminal: Terminal;

    @ApiProperty({ description: 'Table related to the sale', type: () => Table, required: false })
    @ManyToOne(() => Table, { eager: true, nullable: true })
    table: Table;

    @ApiProperty({ description: 'Restaurant to which the sale belongs', type: () => Restaurant })
    @ManyToOne(() => Restaurant, { eager: true }) // Link entire sale to restaurant
    restaurant: Restaurant;

    @ApiProperty({ description: 'Payment method used', type: () => PaymentMethod, required: false })
    @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.sales, { eager: true, nullable: true })
    paymentMethod: PaymentMethod;

    @ApiProperty({ description: 'Details of the items in the sale', type: () => [SaleDetail] })
    @OneToMany(() => SaleDetail, (detail) => detail.sale, { cascade: true, eager: true })
    details: SaleDetail[];
}

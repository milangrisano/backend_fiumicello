import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Terminal } from '../../terminals/entities/terminal.entity';
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity';
import { SaleDetail } from './sale-detail.entity';
import { Table } from '../../tables/entities/table.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { SaleStatus } from '../sale-status.enum';

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int', { unique: true, generated: 'increment' })
    invoiceNumber: number; // Simple sequential number

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column('text', { default: SaleStatus.OPEN })
    status: string; // OPEN, CLOSED, CANCELLED

    @Column('text', { nullable: true })
    dinerName: string;

    @Column('text', { nullable: true })
    dinerEmail: string;

    @Column('text', { nullable: true })
    dinerPhone: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.sales, { eager: true })
    user: User;

    // Terminal is now optional or replaced by Table logic, but we might keep it if "Caja" is different from Table
    @ManyToOne(() => Terminal, (terminal) => terminal.sales, { eager: true, nullable: true })
    terminal: Terminal;

    @ManyToOne(() => Table, { eager: true, nullable: true })
    table: Table;

    @ManyToOne(() => Restaurant, { eager: true }) // Link entire sale to restaurant
    restaurant: Restaurant;

    @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.sales, { eager: true, nullable: true })
    paymentMethod: PaymentMethod;

    @OneToMany(() => SaleDetail, (detail) => detail.sale, { cascade: true, eager: true })
    details: SaleDetail[];
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { User } from '../../users/entities/user.entity';
// import { Sale } from '../../sales/entities/sale.entity'; // Will link later

@Entity('tables')
export class Table {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('text')
    name: string; // "Mesa 1", "Barra 2"

    @Column('boolean', { default: true })
    isActive: boolean;

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables, { onDelete: 'CASCADE' })
    restaurant: Restaurant;

    // Assigned waiter
    @ManyToOne(() => User, (user) => user.tables, { nullable: true })
    user: User;

    // @OneToMany(() => Sale, (sale) => sale.table)
    // sales: Sale[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

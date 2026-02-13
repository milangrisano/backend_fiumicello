import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Table } from '../../tables/entities/table.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity'; // Will be ManyToMany

@Entity('restaurants')
export class Restaurant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    city: string;

    @Column('text', { nullable: true })
    address: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Table, (table) => table.restaurant)
    tables: Table[];

    @OneToMany(() => User, (user) => user.restaurant)
    users: User[];
}

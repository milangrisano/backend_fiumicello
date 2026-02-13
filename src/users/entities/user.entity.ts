import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Table } from '../../tables/entities/table.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isEmailVerified: boolean;

    @Column({ default: false })
    isPhoneVerified: boolean;

    @Column({ nullable: true })
    emailVerificationCode: string;

    @Column({ nullable: true })
    phoneVerificationCode: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    role: Role;

    @OneToMany(() => Sale, (sale) => sale.user)
    sales: Sale[];

    @ManyToOne(() => Restaurant, (restaurant) => restaurant.users, { eager: true, nullable: true })
    restaurant: Restaurant;

    @OneToMany(() => Table, (table) => table.user) // Tables assigned to this user
    tables: Table[];
}

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Table } from '../../tables/entities/table.entity';

@Entity()
export class User {
    @ApiProperty({ description: 'The unique UUID of the user' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'User first name', example: 'John' })
    @Column()
    firstName: string;

    @ApiProperty({ description: 'User last name', example: 'Doe' })
    @Column()
    lastName: string;

    @ApiProperty({ description: 'User email address', example: 'john.doe@example.com' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({ description: 'User password (hashed)', required: false })
    @Column()
    password: string;

    @ApiProperty({ description: 'User phone number', example: '+1234567890', required: false })
    @Column({ nullable: true })
    phone: string;

    @ApiProperty({ description: 'Whether the user is active', default: true })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({ description: 'Whether the user email is verified', default: false })
    @Column({ default: false })
    isEmailVerified: boolean;

    @ApiProperty({ description: 'Whether the user phone is verified', default: false })
    @Column({ default: false })
    isPhoneVerified: boolean;

    @ApiProperty({ description: 'Verification code for email', required: false })
    @Column({ type: 'varchar', nullable: true })
    emailVerificationCode: string | null;

    @ApiProperty({ description: 'Date of expiration for email verification code', required: false })
    @Column({ type: 'timestamp', nullable: true })
    emailVerificationCodeExpiresAt: Date | null;

    @ApiProperty({ description: 'Verification code for phone', required: false })
    @Column({ type: 'varchar', nullable: true })
    phoneVerificationCode: string | null;

    @ApiProperty({ description: 'Date of creation' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Date of last update' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: 'Role of the user', type: () => Role })
    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    role: Role;

    @ApiProperty({ description: 'Sales made by the user', type: () => [Sale] })
    @OneToMany(() => Sale, (sale) => sale.user)
    sales: Sale[];

    @ApiProperty({ description: 'Restaurant the user belongs to', type: () => Restaurant, required: false })
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.users, { eager: true, nullable: true })
    restaurant: Restaurant;

    @ApiProperty({ description: 'Tables assigned to the user', type: () => [Table] })
    @OneToMany(() => Table, (table) => table.user) // Tables assigned to this user
    tables: Table[];
}

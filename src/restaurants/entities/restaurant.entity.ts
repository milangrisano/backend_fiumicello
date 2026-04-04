import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Table } from '../../tables/entities/table.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity'; // Will be ManyToMany

@Entity('restaurants')
export class Restaurant {
    @ApiProperty({ description: 'The unique UUID of the restaurant' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'The name of the restaurant', example: 'Fiumicello Centro' })
    @Column('text')
    name: string;

    @ApiProperty({ description: 'City where the restaurant is located', example: 'Madrid' })
    @Column('text')
    city: string;

    @ApiProperty({ description: 'Address of the restaurant', example: 'Calle Mayor 1', required: false })
    @Column('text', { nullable: true })
    address: string;

    @ApiProperty({ description: 'Whether the restaurant is active', default: true })
    @Column('boolean', { default: true })
    isActive: boolean;

    @ApiProperty({ description: 'Date of creation' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Date of last update' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: 'Tables in the restaurant', type: () => [Table] })
    @OneToMany(() => Table, (table) => table.restaurant)
    tables: Table[];

    @ApiProperty({ description: 'Users (staff) assigned to the restaurant', type: () => [User] })
    @OneToMany(() => User, (user) => user.restaurant)
    users: User[];

    @ApiProperty({ description: 'Products sold in this restaurant', type: () => [Product] })
    @OneToMany(() => Product, (product) => product.restaurant)
    products: Product[];
}

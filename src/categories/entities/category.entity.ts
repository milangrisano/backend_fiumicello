import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Category {
    @ApiProperty({ description: 'The unique UUID of the category', example: '123e4567-e89b-12d3-a456-426614174000' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({ description: 'Target identifier/name of the category', example: 'Pizzas' })
    @Column('text')
    name: string;

    @ApiProperty({ description: 'Detailed description of the category', required: false })
    @Column('text', { nullable: true })
    description: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];

    @ApiProperty({ description: 'Date of creation' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Date of last update' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: 'Active status', default: true })
    @Column('boolean', { default: true })
    isActive: boolean;
}

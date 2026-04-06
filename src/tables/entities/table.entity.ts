import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { User } from '../../users/entities/user.entity';
// import { Sale } from '../../sales/entities/sale.entity'; // Will link later

@Entity('tables')
export class Table {
    @ApiProperty({ description: 'The unique identifier of the table', example: 1 })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({ description: 'The name or label of the table', example: 'Mesa 1' })
    @Column('text')
    name: string; // "Mesa 1", "Barra 2"

    @ApiProperty({ description: 'Whether the table is active', default: true })
    @Column('boolean', { default: true })
    isActive: boolean;

    @ApiProperty({ description: 'X coordinate for visual layout', required: false, default: 0 })
    @Column('float', { default: 0 })
    x: number;

    @ApiProperty({ description: 'Y coordinate for visual layout', required: false, default: 0 })
    @Column('float', { default: 0 })
    y: number;

    @ApiProperty({ description: 'The restaurant this table belongs to', type: () => Restaurant })
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables, { onDelete: 'CASCADE', eager: true })
    restaurant: Restaurant;

    // Assigned waiter
    @ApiProperty({ description: 'The waiter assigned to this table', type: () => User, required: false })
    @ManyToOne(() => User, (user) => user.tables, { nullable: true, eager: true })
    user: User;

    // @OneToMany(() => Sale, (sale) => sale.table)
    // sales: Sale[];

    @ApiProperty({ description: 'Date of creation' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Date of last update' })
    @UpdateDateColumn()
    updatedAt: Date;
}

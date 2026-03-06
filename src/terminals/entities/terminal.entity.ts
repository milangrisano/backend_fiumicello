import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Sale } from '../../sales/entities/sale.entity';

@Entity('terminals')
export class Terminal {
    @ApiProperty({ description: 'The unique identifier of the terminal', example: 1 })
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({ description: 'The name or label of the terminal', example: 'Caja 1' })
    @Column('text', { unique: true })
    name: string;

    @ApiProperty({ description: 'Whether the terminal is active', default: true })
    @Column('boolean', { default: true })
    isActive: boolean;

    @ApiProperty({ description: 'Date of creation' })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({ description: 'Date of last update' })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({ description: 'Sales processed through this terminal', type: () => [Sale] })
    @OneToMany(() => Sale, (sale) => sale.terminal)
    sales: Sale[];
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Role {
    @ApiProperty({ description: 'The unique identifier of the role', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'The name of the role', example: 'Admin' })
    @Column({ unique: true })
    name: string;

    @ApiProperty({ description: 'A brief description of the role', example: 'System administrator', required: false })
    @Column({ nullable: true })
    description: string;

    @ApiProperty({ description: 'Whether the role is active or not', default: true })
    @Column({ default: true })
    isActive: boolean;

    @ApiProperty({ description: 'The permissions assigned to the role', example: ['sales:access'] })
    @Column('simple-array', { default: '' })
    permissions: string[];

    @ApiProperty({ description: 'The default route or landing page for the role after login', example: '/sales', required: false })
    @Column({ nullable: true })
    defaultRoute: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}

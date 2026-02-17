import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John', description: 'The first name of the user' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the user' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password of the user', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: '+1234567890', description: 'The phone number of the user', required: false })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: 1, description: 'The role ID of the user', required: false })
    @IsNumber()
    @IsOptional()
    roleId?: number;

    @ApiProperty({ example: true, description: 'Whether the user is active', required: false, default: true })
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ example: 'uuid-restaurant-id', description: 'The restaurant ID', required: false })
    @IsString()
    @IsOptional()
    restaurantId?: string;

    // @IsArray()
    // @IsOptional()
    // tableIds?: number[]; // Optional for now, can be done via separate endpoint or update
}

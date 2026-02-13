import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsNumber } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsNumber()
    @IsOptional()
    roleId?: number;

    @IsOptional()
    isActive?: boolean;

    @IsString()
    @IsOptional()
    restaurantId?: string;

    // @IsArray()
    // @IsOptional()
    // tableIds?: number[]; // Optional for now, can be done via separate endpoint or update
}

import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateRestaurantDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    city: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

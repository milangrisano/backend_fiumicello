import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    type: string;

    @IsString()
    category: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsBoolean()
    @IsOptional()
    availability?: boolean;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsArray()
    @IsOptional()
    restaurantIds?: string[];

    @IsArray()
    @IsOptional()
    images?: { url: string; name?: string }[];
}

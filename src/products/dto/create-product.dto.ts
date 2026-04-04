import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsUUID()
    categoryId: string;

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

    @IsUUID()
    restaurantId: string;

    @IsArray()
    @IsOptional()
    images?: { url: string; name?: string }[];
}

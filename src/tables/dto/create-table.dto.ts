import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsUUID, IsNumber } from 'class-validator';

export class CreateTableDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUUID()
    @IsNotEmpty()
    restaurantId: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsNumber()
    @IsOptional()
    x?: number;

    @IsNumber()
    @IsOptional()
    y?: number;
}

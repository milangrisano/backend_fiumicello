import { IsString, IsNotEmpty, IsBoolean, IsOptional, IsUUID } from 'class-validator';

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
}

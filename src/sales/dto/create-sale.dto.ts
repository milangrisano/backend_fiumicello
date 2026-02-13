import { IsNumber, IsUUID, IsArray, ValidateNested, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

class SaleDetailItemDto {
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateSaleDto {
    @IsNumber()
    @IsNotEmpty()
    tableId: number;
}

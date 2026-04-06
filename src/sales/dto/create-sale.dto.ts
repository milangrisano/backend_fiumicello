import { IsNumber, IsUUID, IsArray, ValidateNested, IsNotEmpty, Min, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderType } from '../order-type.enum';

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
    @IsOptional()
    tableId?: number;

    @IsString()
    @IsOptional()
    dinerName?: string;

    @IsEnum(OrderType)
    @IsOptional()
    orderType?: OrderType;
}

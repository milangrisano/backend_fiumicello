import { IsArray, ValidateNested, IsUUID, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

class SaleDetailItemDto {
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class AddItemsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SaleDetailItemDto)
    items: SaleDetailItemDto[];
}

import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SaleStatus } from '../sale-status.enum';

export class UpdateSaleStatusDto {
    @ApiProperty({ description: 'The new status of the sale/order', enum: SaleStatus })
    @IsNotEmpty()
    @IsEnum(SaleStatus)
    status: SaleStatus;
}

import { IsNumber, IsNotEmpty, IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InvoiceType } from '../invoice-type.enum';

export class CloseSaleDto {
    @ApiProperty({ description: 'ID of the payment method used' })
    @IsNumber()
    @IsNotEmpty()
    paymentMethodId: number;

    @ApiProperty({ description: 'Type of invoice the diner requested (POS or ELECTRONIC)', enum: InvoiceType })
    @IsEnum(InvoiceType)
    @IsNotEmpty()
    invoiceType: InvoiceType;

    @IsString()
    @IsOptional()
    dinerName?: string;

    @IsEmail()
    @IsOptional()
    dinerEmail?: string;

    @IsString()
    @IsOptional()
    dinerPhone?: string;
}

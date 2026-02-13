import { IsNumber, IsNotEmpty, IsString, IsOptional, IsEmail } from 'class-validator';

export class CloseSaleDto {
    @IsNumber()
    @IsNotEmpty()
    paymentMethodId: number;

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

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ description: 'The name of the category', example: 'Pizzas' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Detailed description of the category', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Status of the category', default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

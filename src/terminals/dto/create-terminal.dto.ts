import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateTerminalDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}

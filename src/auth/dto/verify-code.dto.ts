import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyCodeDto {
    @ApiProperty({ description: 'User email address', example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'The 6-digit verification code', example: '123456' })
    @IsString()
    @Length(6, 6)
    @IsNotEmpty()
    code: string;
}

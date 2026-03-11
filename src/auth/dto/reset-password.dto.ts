import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ description: 'User email address', example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'The 6-digit verification code sent by email', example: '123456' })
    @IsString()
    @Length(6, 6)
    @IsNotEmpty()
    code: string;

    @ApiProperty({ description: 'The new password (min 6 characters)', example: 'newSecurePass123' })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    newPassword: string;
}

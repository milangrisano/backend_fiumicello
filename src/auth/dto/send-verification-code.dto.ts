import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendVerificationCodeDto {
    @ApiProperty({ description: 'User email address', example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

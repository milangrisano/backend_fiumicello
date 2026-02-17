import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
    @ApiProperty({ example: 'Milan', description: 'The first name of the user' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Grisano', description: 'The last name of the user' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'milan@example.com', description: 'The email of the user' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'securePass123', description: 'The password of the user', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: '+1234567890', description: 'The phone number of the user', required: false })
    @IsString()
    @IsOptional()
    phone?: string;
}

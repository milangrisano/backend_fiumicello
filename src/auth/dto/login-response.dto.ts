import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
    @ApiProperty({ description: 'JWT Access Token', example: 'eyJhbGciOiJIUzI1NiIsInR5c...' })
    access_token: string;
}

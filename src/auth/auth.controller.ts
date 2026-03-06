import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiUnauthorizedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../users/entities/user.entity';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user', description: 'Authenticates a user and returns a JWT token.' })
    @ApiCreatedResponse({ description: 'User successfully logged in and token generated.', type: LoginResponseDto })
    @ApiUnauthorizedResponse({ description: 'Unauthorized. Invalid credentials.' })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user); // returns access_token
    }

    @Post('register')
    @ApiOperation({ summary: 'Register new user', description: 'Registers a new user with Guest role.' })
    @ApiCreatedResponse({ description: 'User successfully registered.', type: User })
    @ApiBadRequestResponse({ description: 'Bad Request.' })
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const superAdminDto: CreateUserDto = {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        password: 'supersecurepassword',
    };

    try {
        const user = await usersService.createSuperAdmin(superAdminDto);
        console.log('Super Admin created or already exists:', user);
    } catch (error) {
        console.error('Error creating Super Admin:', error);
    }

    await app.close();
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);
    const configService = app.get(ConfigService);

    const superAdminDto = {
        firstName: 'Super',
        lastName: 'Admin',
        email: configService.get<string>('SUPER_ADMIN_EMAIL') || 'superadmin@example.com',
        password: configService.get<string>('SUPER_ADMIN_PASSWORD') || 'supersecurepassword',
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

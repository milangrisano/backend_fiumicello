import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesService } from './roles/roles.service';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const rolesService = app.get(RolesService);
    const usersService = app.get(UsersService);
    const configService = app.get(ConfigService);

    // 1. Ensure Roles Exist
    const roles = ['Super Admin', 'Admin', 'Guest'];
    for (const roleName of roles) {
        let role = await rolesService.findByName(roleName);
        if (!role) {
            console.log(`Creating role: ${roleName}`);
            await rolesService.create({ name: roleName, description: `${roleName} Role` });
        }
    }

    // 2. Ensure Super Admin User Exists (Credentials from .env)
    const superAdminEmail = configService.get<string>('SUPER_ADMIN_EMAIL');
    const superAdminPassword = configService.get<string>('SUPER_ADMIN_PASSWORD');

    if (!superAdminEmail || !superAdminPassword) {
        console.error('SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set in environment variables.');
        await app.close();
        process.exit(1);
    }

    const existingSuperAdmin = await usersService.findByEmail(superAdminEmail);

    if (!existingSuperAdmin) {
        console.log('Creating Super Admin user...');

        const superAdminDto: CreateUserDto = {
            firstName: 'Super',
            lastName: 'Admin',
            email: superAdminEmail,
            password: superAdminPassword,
            phone: '+1234567890',
            roleId: 1
        };

        await usersService.createSuperAdmin(superAdminDto);
        console.log('Super Admin user created successfully.');
    } else {
        console.log('Super Admin user already exists.');
    }

    await app.close();
}
bootstrap();

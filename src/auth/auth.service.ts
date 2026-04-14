import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RolesService } from '../roles/roles.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        private jwtService: JwtService,
        private rolesService: RolesService,
        private mailService: MailService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.isActive && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { 
            username: user.email, 
            sub: user.id, 
            role: user.role?.name,
            permissions: user.role?.permissions || [],
            defaultRoute: user.role?.defaultRoute || null
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
            }
        };
    }

    async register(registerUserDto: RegisterUserDto) {
        const guestRole = await this.rolesService.findByName('Guest');
        if (!guestRole) {
            throw new UnauthorizedException('Default role not found');
        }

        return this.usersService.create({
            ...registerUserDto,
            roleId: guestRole.id,
        });
    }

    async generateVerificationCode(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            // Se debe retornar un éxito silencioso para no exponer qué correos existen en la base de datos
            return { message: 'If the email exists, a verification code has been sent.' };
        }

        // Generar código de 6 dígitos puro numérico
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        // Expiración en 3 minutos
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

        await this.usersService.updateVerificationCode(email, code, expiresAt);

        await this.mailService.sendVerificationCode(email, code);

        return { message: 'If the email exists, a verification code has been sent.' };
    }

    async verifyEmailCode(email: string, code: string) {
        const isValid = await this.usersService.verifyEmail(email, code);
        if (!isValid) {
            throw new UnauthorizedException('Invalid or expired verification code');
        }

        return { message: 'Email successfully verified' };
    }

    async sendPasswordResetCode(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            // Respuesta silenciosa: no revelar qué emails existen
            return { message: 'If the email exists, a password reset code has been sent.' };
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutos

        await this.usersService.updateVerificationCode(email, code, expiresAt);
        await this.mailService.sendPasswordResetCode(email, code);

        return { message: 'If the email exists, a password reset code has been sent.' };
    }

    async resetPassword(email: string, code: string, newPassword: string) {
        const success = await this.usersService.resetPassword(email, code, newPassword);
        if (!success) {
            throw new UnauthorizedException('Invalid or expired verification code');
        }
        return { message: 'Password reset successfully' };
    }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
    private readonly resend: Resend;
    private readonly from: string;
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly configService: ConfigService) {
        this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
        this.from = this.configService.get<string>('MAIL_FROM') ?? 'onboarding@resend.dev';
    }

    async sendVerificationCode(to: string, code: string): Promise<void> {
        try {
            await this.resend.emails.send({
                from: this.from,
                to,
                subject: 'Tu código de verificación - Fiumicello',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background-color: #f9f9f9; border-radius: 8px;">
                        <h2 style="color: #222; text-align: center;">Verificación de correo</h2>
                        <p style="color: #555;">Hola,</p>
                        <p style="color: #555;">Ingresa el siguiente código para verificar tu dirección de correo electrónico. Este código expira en <strong>3 minutos</strong>.</p>
                        <div style="text-align: center; margin: 32px 0;">
                            <span style="
                                display: inline-block;
                                font-size: 36px;
                                font-weight: bold;
                                letter-spacing: 10px;
                                color: #1a1a1a;
                                background: #fff;
                                border: 2px solid #e0e0e0;
                                border-radius: 8px;
                                padding: 16px 24px;
                            ">${code}</span>
                        </div>
                        <p style="color: #888; font-size: 13px; text-align: center;">Si no solicitaste este código, ignora este correo.</p>
                    </div>
                `,
            });
            this.logger.log(`Verification code sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}:`, error);
            throw error;
        }
    }
}

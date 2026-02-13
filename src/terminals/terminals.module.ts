import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminalsService } from './terminals.service';
import { TerminalsController } from './terminals.controller';
import { Terminal } from './entities/terminal.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Terminal]),
        AuthModule,
    ],
    controllers: [TerminalsController],
    providers: [TerminalsService],
    exports: [TerminalsService],
})
export class TerminalsModule { }

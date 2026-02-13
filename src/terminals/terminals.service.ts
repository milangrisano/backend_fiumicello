import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Terminal } from './entities/terminal.entity';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';

@Injectable()
export class TerminalsService {
    constructor(
        @InjectRepository(Terminal)
        private readonly terminalRepository: Repository<Terminal>,
    ) { }

    async create(createTerminalDto: CreateTerminalDto) {
        const terminal = this.terminalRepository.create(createTerminalDto);
        return this.terminalRepository.save(terminal);
    }

    findAll() {
        return this.terminalRepository.find({
            where: { isActive: true }
        });
    }

    async findOne(id: number) {
        const terminal = await this.terminalRepository.findOneBy({ id });
        if (!terminal) {
            throw new NotFoundException(`Terminal with ID ${id} not found`);
        }
        return terminal;
    }

    async update(id: number, updateTerminalDto: UpdateTerminalDto) {
        const terminal = await this.terminalRepository.preload({
            id: id,
            ...updateTerminalDto,
        });

        if (!terminal) {
            throw new NotFoundException(`Terminal with ID ${id} not found`);
        }

        return this.terminalRepository.save(terminal);
    }
}

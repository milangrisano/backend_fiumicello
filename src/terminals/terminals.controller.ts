import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TerminalsService } from './terminals.service';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('terminals')
@UseGuards(JwtAuthGuard)
export class TerminalsController {
    constructor(private readonly terminalsService: TerminalsService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('Super Admin', 'Admin')
    create(@Body() createTerminalDto: CreateTerminalDto) {
        return this.terminalsService.create(createTerminalDto);
    }

    @Get()
    findAll() {
        return this.terminalsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.terminalsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('Super Admin', 'Admin')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTerminalDto: UpdateTerminalDto) {
        return this.terminalsService.update(id, updateTerminalDto);
    }
}

import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { TerminalsService } from './terminals.service';
import { Terminal } from './entities/terminal.entity';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@ApiTags('Terminals')
@Controller('terminals')
@UseGuards(JwtAuthGuard)
export class TerminalsController {
    constructor(private readonly terminalsService: TerminalsService) { }

    @Post()
    @ApiOperation({ summary: 'Create terminal', description: 'Creates a new terminal. Requires Super Admin or Admin role.' })
    @ApiCreatedResponse({ description: 'The terminal has been successfully created.', type: Terminal })
    @ApiForbiddenResponse({ description: 'Forbidden. Requires Super Admin, Admin or Administrador role.' })
    @UseGuards(RolesGuard)
    @Roles('Super Admin', 'Admin', 'Administrador')
    create(@Body() createTerminalDto: CreateTerminalDto) {
        return this.terminalsService.create(createTerminalDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all terminals', description: 'Retrieves a list of all terminals.' })
    @ApiOkResponse({ description: 'List of terminals.', type: [Terminal] })
    findAll() {
        return this.terminalsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get terminal by ID', description: 'Retrieves a single terminal by ID.' })
    @ApiOkResponse({ description: 'The terminal found.', type: Terminal })
    @ApiNotFoundResponse({ description: 'Terminal not found.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.terminalsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update terminal', description: 'Updates a terminal by ID. Requires Super Admin or Admin role.' })
    @ApiOkResponse({ description: 'The terminal has been successfully updated.', type: Terminal })
    @ApiNotFoundResponse({ description: 'Terminal not found.' })
    @ApiForbiddenResponse({ description: 'Forbidden. Requires Super Admin, Admin or Administrador role.' })
    @UseGuards(RolesGuard)
    @Roles('Super Admin', 'Admin', 'Administrador')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTerminalDto: UpdateTerminalDto) {
        return this.terminalsService.update(id, updateTerminalDto);
    }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { Table } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Tables')
@Controller('tables')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TablesController {
    constructor(private readonly tablesService: TablesService) { }

    @Post()
    @ApiOperation({ summary: 'Create table', description: 'Creates a new table. Requires Super Admin or Admin role.' })
    @ApiCreatedResponse({ description: 'The table has been successfully created.', type: Table })
    @ApiForbiddenResponse({ description: 'Forbidden. Requires tables:manage permission.' })
    @RequirePermissions('tables:manage')
    create(@Body() createTableDto: CreateTableDto) {
        return this.tablesService.create(createTableDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tables', description: 'Retrieves a list of all tables, optionally filtered by restaurant ID.' })
    @ApiOkResponse({ description: 'List of tables.', type: [Table] })
    @RequirePermissions('tables:view')
    findAll(@Query('restaurantId') restaurantId?: string) {
        return this.tablesService.findAll(restaurantId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get table by ID', description: 'Retrieves a single table by ID.' })
    @ApiOkResponse({ description: 'The table found.', type: Table })
    @ApiNotFoundResponse({ description: 'Table not found.' })
    @RequirePermissions('tables:view')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tablesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update table', description: 'Updates a table by ID. Requires Super Admin or Admin role.' })
    @ApiOkResponse({ description: 'The table has been successfully updated.', type: Table })
    @ApiNotFoundResponse({ description: 'Table not found.' })
    @ApiForbiddenResponse({ description: 'Forbidden. Requires tables:manage permission.' })
    @RequirePermissions('tables:manage')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTableDto: UpdateTableDto) {
        return this.tablesService.update(id, updateTableDto);
    }

    @Patch(':id/deactivate')
    @ApiOperation({ summary: 'Deactivate table', description: 'Deactivates a table by ID. Requires Super Admin or Admin role.' })
    @ApiOkResponse({ description: 'The table has been successfully deactivated.' })
    @ApiNotFoundResponse({ description: 'Table not found.' })
    @ApiForbiddenResponse({ description: 'Forbidden. Requires tables:manage permission.' })
    @RequirePermissions('tables:manage')
    deactivate(@Param('id') id: string) {
        return this.tablesService.deactivate(+id);
    }
}

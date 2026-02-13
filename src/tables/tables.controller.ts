import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('tables')
@UseGuards(JwtAuthGuard)
export class TablesController {
    constructor(private readonly tablesService: TablesService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('Super Admin', 'Admin')
    create(@Body() createTableDto: CreateTableDto) {
        return this.tablesService.create(createTableDto);
    }

    @Get()
    findAll(@Query('restaurantId') restaurantId?: string) {
        return this.tablesService.findAll(restaurantId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.tablesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('Super Admin', 'Admin')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateTableDto: UpdateTableDto) {
        return this.tablesService.update(id, updateTableDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('Super Admin', 'Admin')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.tablesService.remove(id);
    }
}

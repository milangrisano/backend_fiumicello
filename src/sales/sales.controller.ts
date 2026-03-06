import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AddItemsDto } from './dto/add-items.dto';
import { CloseSaleDto } from './dto/close-sale.dto';
import { UpdateSaleStatusDto } from './dto/update-sale-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@ApiTags('Sales')
@Controller('sales')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new sale', description: 'Creates a new empty sale (or with items if provided).' })
    @ApiCreatedResponse({ description: 'The sale has been successfully created.', type: Sale })
    @Roles('Super Admin', 'Admin', 'Manager', 'Waiter')
    create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
        return this.salesService.create(createSaleDto, req.user);
    }

    @Post(':id/items')
    @ApiOperation({ summary: 'Add items to sale', description: 'Adds new products/details to an open sale.' })
    @ApiCreatedResponse({ description: 'The items have been added successfully.', type: Sale })
    @ApiNotFoundResponse({ description: 'Sale not found.' })
    @Roles('Super Admin', 'Admin', 'Manager', 'Waiter')
    addItems(@Param('id') id: string, @Body() addItemsDto: AddItemsDto, @Request() req) {
        return this.salesService.addItems(id, addItemsDto, req.user);
    }

    @Patch(':id/close')
    @ApiOperation({ summary: 'Close sale', description: 'Changes the status of a sale to CLOSED and assigns payment method.' })
    @ApiOkResponse({ description: 'The sale has been successfully closed.', type: Sale })
    @ApiNotFoundResponse({ description: 'Sale not found.' })
    @Roles('Super Admin', 'Admin', 'Manager', 'Cashier', 'Waiter')
    close(@Param('id') id: string, @Body() closeSaleDto: CloseSaleDto, @Request() req) {
        return this.salesService.close(id, closeSaleDto, req.user);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update sale status', description: 'Updates the status of a sale (e.g., COMMANDED, IN_PROGRESS, READY).' })
    @ApiOkResponse({ description: 'The sale status has been successfully updated.', type: Sale })
    @ApiNotFoundResponse({ description: 'Sale not found.' })
    @Roles('Super Admin', 'Admin', 'Manager', 'Chef', 'Waiter')
    updateStatus(@Param('id') id: string, @Body() updateSaleStatusDto: UpdateSaleStatusDto, @Request() req) {
        return this.salesService.updateStatus(id, updateSaleStatusDto, req.user);
    }

    @Get()
    @ApiOperation({ summary: 'Get all sales', description: 'Retrieves a list of all sales.' })
    @ApiOkResponse({ description: 'List of sales.', type: [Sale] })
    findAll(@Request() req) {
        return this.salesService.findAll(req.user);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a sale by ID', description: 'Retrieves a single sale by ID.' })
    @ApiOkResponse({ description: 'The sale found.', type: Sale })
    @ApiNotFoundResponse({ description: 'Sale not found.' })
    findOne(@Param('id') id: string, @Request() req) {
        return this.salesService.findOne(id, req.user);
    }
}

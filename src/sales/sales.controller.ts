import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AddItemsDto } from './dto/add-items.dto';
import { CloseSaleDto } from './dto/close-sale.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
    constructor(private readonly salesService: SalesService) { }

    @Post()
    create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
        return this.salesService.create(createSaleDto, req.user);
    }

    @Post(':id/items')
    addItems(@Param('id') id: string, @Body() addItemsDto: AddItemsDto, @Request() req) {
        return this.salesService.addItems(id, addItemsDto, req.user);
    }

    @Patch(':id/close')
    close(@Param('id') id: string, @Body() closeSaleDto: CloseSaleDto, @Request() req) {
        return this.salesService.close(id, closeSaleDto, req.user);
    }

    @Get()
    findAll() {
        return this.salesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.salesService.findOne(id);
    }
}

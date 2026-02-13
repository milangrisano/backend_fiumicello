import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('payment-methods')
@UseGuards(JwtAuthGuard) // Protect all routes
export class PaymentMethodsController {
    constructor(private readonly paymentMethodsService: PaymentMethodsService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('Super Admin', 'Admin')
    create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
        return this.paymentMethodsService.create(createPaymentMethodDto);
    }

    @Get()
    findAll() {
        return this.paymentMethodsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.paymentMethodsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('Super Admin', 'Admin')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto) {
        return this.paymentMethodsService.update(id, updatePaymentMethodDto);
    }

    // Soft delete via isActive toggle via Patch is preferred, but user asked for CRUD.
    // I will keep remove endpoint mapping to soft delete logic in service for completeness if they call DELETE,
    // OR just rely on PATCH.
    // Given previous instruction "eliminalo y coloca una columna", I'll remove the DELETE endpoint and rely on PATCH for consistency.
    // So NO @Delete endpoint here.
}

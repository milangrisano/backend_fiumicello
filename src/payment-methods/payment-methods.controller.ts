import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Payment Methods')
@Controller('payment-methods')
@UseGuards(JwtAuthGuard, PermissionsGuard) // Protect all routes
export class PaymentMethodsController {
    constructor(private readonly paymentMethodsService: PaymentMethodsService) { }

    @Post()
    @ApiOperation({ summary: 'Create payment method', description: 'Creates a new payment method. Requires Super Admin or Admin role.' })
    @ApiCreatedResponse({ description: 'The payment method has been successfully created.', type: PaymentMethod })
    @ApiForbiddenResponse({ description: 'Forbidden. Requires utilities:payment_methods permission.' })
    @RequirePermissions('utilities:payment_methods')
    create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
        return this.paymentMethodsService.create(createPaymentMethodDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all payment methods', description: 'Retrieves a list of all payment methods.' })
    @ApiOkResponse({ description: 'List of payment methods.', type: [PaymentMethod] })
    findAll() {
        return this.paymentMethodsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get payment method by ID', description: 'Retrieves a single payment method by ID.' })
    @ApiOkResponse({ description: 'The payment method found.', type: PaymentMethod })
    @ApiNotFoundResponse({ description: 'Payment method not found.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.paymentMethodsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update payment method', description: 'Updates a payment method by ID. Requires Super Admin or Admin role.' })
    @ApiOkResponse({ description: 'The payment method has been successfully updated.', type: PaymentMethod })
    @ApiNotFoundResponse({ description: 'Payment method not found.' })
    @ApiForbiddenResponse({ description: 'Forbidden. Requires utilities:payment_methods permission.' })
    @RequirePermissions('utilities:payment_methods')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto) {
        return this.paymentMethodsService.update(id, updatePaymentMethodDto);
    }

    // Soft delete via isActive toggle via Patch is preferred, but user asked for CRUD.
    // I will keep remove endpoint mapping to soft delete logic in service for completeness if they call DELETE,
    // OR just rely on PATCH.
    // Given previous instruction "eliminalo y coloca una columna", I'll remove the DELETE endpoint and rely on PATCH for consistency.
    // So NO @Delete endpoint here.
}

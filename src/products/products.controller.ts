import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, UseGuards, Req, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Create product', description: 'Creates a new product.' })
    @ApiCreatedResponse({ description: 'The product has been successfully created.', type: Product })
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get all products', description: 'Retrieves a list of all products.' })
    @ApiOkResponse({ description: 'List of products.', type: [Product] })
    findAll(@Req() req, @Query('restaurantId') restaurantId?: string) {
        return this.productsService.findAll(req.user, restaurantId);
    }

    @Get(':term')
    @ApiOperation({ summary: 'Get product by term', description: 'Retrieves a single product by ID or term.' })
    @ApiOkResponse({ description: 'The product found.', type: Product })
    @ApiNotFoundResponse({ description: 'Product not found.' })
    findOne(@Param('term') term: string) {
        return this.productsService.findOne(term);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Update product', description: 'Updates a product by ID.' })
    @ApiOkResponse({ description: 'The product has been successfully updated.', type: Product })
    @ApiNotFoundResponse({ description: 'Product not found.' })
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productsService.update(id, updateProductDto);
    }

    @Patch(':id/deactivate')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Deactivate product', description: 'Deactivates a product by ID.' })
    @ApiOkResponse({ description: 'The product has been successfully deactivated.' })
    @ApiNotFoundResponse({ description: 'Product not found.' })
    deactivate(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.deactivate(id);
    }


}

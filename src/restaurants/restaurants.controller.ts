import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@ApiTags('Restaurants')
@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    @Post()
    @ApiOperation({ summary: 'Create restaurant', description: 'Creates a new restaurant. Requires Super Admin role.' })
    @ApiCreatedResponse({ description: 'The restaurant has been successfully created.', type: Restaurant })
    @ApiForbiddenResponse({ description: 'Forbidden. Requires Super Admin or Admin role.' })
    @Roles('Super Admin', 'Admin', 'Administrador')
    create(@Body() createRestaurantDto: CreateRestaurantDto) {
        return this.restaurantsService.create(createRestaurantDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all restaurants', description: 'Retrieves a list of all restaurants.' })
    @ApiOkResponse({ description: 'List of restaurants.', type: [Restaurant] })
    findAll() {
        return this.restaurantsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get restaurant by ID', description: 'Retrieves a single restaurant by ID.' })
    @ApiOkResponse({ description: 'The restaurant found.', type: Restaurant })
    @ApiNotFoundResponse({ description: 'Restaurant not found.' })
    findOne(@Param('id') id: string) {
        return this.restaurantsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update restaurant', description: 'Updates a restaurant by ID. Requires Super Admin or Admin role.' })
    @ApiOkResponse({ description: 'The restaurant has been successfully updated.', type: Restaurant })
    @ApiNotFoundResponse({ description: 'Restaurant not found.' })
    @ApiForbiddenResponse({ description: 'Forbidden. Requires Super Admin or Admin role.' })
    @Roles('Super Admin', 'Admin', 'Administrador')
    update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
        return this.restaurantsService.update(id, updateRestaurantDto);
    }

    @Patch(':id/deactivate')
    @ApiOperation({ summary: 'Deactivate restaurant', description: 'Deactivates a restaurant by ID. Requires Super Admin role.' })
    @ApiOkResponse({ description: 'The restaurant has been successfully deactivated.' })
    @ApiNotFoundResponse({ description: 'Restaurant not found.' })
    @ApiForbiddenResponse({ description: 'Forbidden. Requires Super Admin or Admin role.' })
    @Roles('Super Admin', 'Admin', 'Administrador')
    deactivate(@Param('id') id: string) {
        return this.restaurantsService.deactivate(id);
    }
}

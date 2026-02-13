import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    @Post()
    @Roles('Super Admin')
    create(@Body() createRestaurantDto: CreateRestaurantDto) {
        return this.restaurantsService.create(createRestaurantDto);
    }

    @Get()
    findAll() {
        return this.restaurantsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.restaurantsService.findOne(id);
    }

    @Patch(':id')
    @Roles('Super Admin', 'Admin')
    update(@Param('id') id: string, @Body() updateRestaurantDto: UpdateRestaurantDto) {
        return this.restaurantsService.update(id, updateRestaurantDto);
    }

    @Delete(':id')
    @Roles('Super Admin')
    remove(@Param('id') id: string) {
        return this.restaurantsService.remove(id);
    }
}

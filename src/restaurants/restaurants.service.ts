import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurantRepository: Repository<Restaurant>,
    ) { }

    create(createRestaurantDto: CreateRestaurantDto) {
        const restaurant = this.restaurantRepository.create(createRestaurantDto);
        return this.restaurantRepository.save(restaurant);
    }

    findAll() {
        return this.restaurantRepository.find({ where: { isActive: true } });
    }

    async findOne(id: string) {
        const restaurant = await this.restaurantRepository.findOne({
            where: { id },
            relations: ['tables'] // Load tables by default for convenience
        });
        if (!restaurant) {
            throw new NotFoundException(`Restaurant with ID ${id} not found`);
        }
        return restaurant;
    }

    async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
        const restaurant = await this.restaurantRepository.preload({
            id: id,
            ...updateRestaurantDto,
        });

        if (!restaurant) {
            throw new NotFoundException(`Restaurant with ID ${id} not found`);
        }

        return this.restaurantRepository.save(restaurant);
    }

    async remove(id: string) {
        const restaurant = await this.findOne(id);
        restaurant.isActive = false;
        return this.restaurantRepository.save(restaurant);
    }
}

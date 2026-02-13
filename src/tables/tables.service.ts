import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from './entities/table.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Restaurant } from '../restaurants/entities/restaurant.entity';

@Injectable()
export class TablesService {
    constructor(
        @InjectRepository(Table)
        private readonly tableRepository: Repository<Table>,
        @InjectRepository(Restaurant)
        private readonly restaurantRepository: Repository<Restaurant>,
    ) { }

    async create(createTableDto: CreateTableDto) {
        const restaurant = await this.restaurantRepository.findOneBy({ id: createTableDto.restaurantId });
        if (!restaurant) throw new NotFoundException('Restaurant not found');

        const table = this.tableRepository.create({
            ...createTableDto,
            restaurant: restaurant
        });
        return this.tableRepository.save(table);
    }

    findAll(restaurantId?: string) {
        const whereCondition: any = { isActive: true };
        if (restaurantId) {
            whereCondition.restaurant = { id: restaurantId };
        }
        return this.tableRepository.find({
            where: whereCondition,
            relations: ['restaurant']
        });
    }

    async findOne(id: number) {
        const table = await this.tableRepository.findOne({
            where: { id },
            relations: ['restaurant']
        });
        if (!table) {
            throw new NotFoundException(`Table with ID ${id} not found`);
        }
        return table;
    }

    async update(id: number, updateTableDto: UpdateTableDto) {
        const table = await this.tableRepository.preload({
            id: id,
            ...updateTableDto,
        });

        if (!table) {
            throw new NotFoundException(`Table with ID ${id} not found`);
        }

        if (updateTableDto.restaurantId) {
            const restaurant = await this.restaurantRepository.findOneBy({ id: updateTableDto.restaurantId });
            if (!restaurant) throw new NotFoundException('Restaurant not found');
            table.restaurant = restaurant;
        }

        return this.tableRepository.save(table);
    }

    async remove(id: number) {
        const table = await this.findOne(id);
        table.isActive = false;
        return this.tableRepository.save(table);
    }
}

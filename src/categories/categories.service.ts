import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const category = this.categoryRepository.create(createCategoryDto);
        return this.categoryRepository.save(category);
    }

    findAll() {
        return this.categoryRepository.find();
    }

    async findOne(id: string) {
        const category = await this.categoryRepository.findOneBy({ id });
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.categoryRepository.preload({
            id: id,
            ...updateCategoryDto,
        });

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return this.categoryRepository.save(category);
    }

    async deactivate(id: string) {
        const category = await this.findOne(id);
        category.isActive = !category.isActive;
        return this.categoryRepository.save(category);
    }

    async deleteAllCategories() {
        const query = this.categoryRepository.createQueryBuilder('category');
        try {
            return await query.delete().where({}).execute();
        } catch (error) {
            console.error('Error deleting categories:', error);
            throw error;
        }
    }
}

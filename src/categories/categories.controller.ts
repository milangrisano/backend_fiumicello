import { Controller, Get, Post, Body, Patch, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @ApiOperation({ summary: 'Create category', description: 'Creates a new category. Requires Super Admin, Admin or Administrador role.' })
    @ApiCreatedResponse({ description: 'The category has been successfully created.', type: Category })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @RequirePermissions('utilities:categories')
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories', description: 'Retrieves a list of all categories.' })
    @ApiOkResponse({ description: 'List of categories.', type: [Category] })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get category by ID', description: 'Retrieves a single category by ID.' })
    @ApiOkResponse({ description: 'The category found.', type: Category })
    @ApiNotFoundResponse({ description: 'Category not found.' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update category', description: 'Updates a category by ID. Requires Super Admin, Admin or Administrador role.' })
    @ApiOkResponse({ description: 'The category has been successfully updated.', type: Category })
    @ApiNotFoundResponse({ description: 'Category not found.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @RequirePermissions('utilities:categories')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Patch(':id/deactivate')
    @ApiOperation({ summary: 'Toggle category status', description: 'Toggles category isActive. Requires Super Admin, Admin or Administrador role.' })
    @ApiOkResponse({ description: 'The category status has been successfully updated.' })
    @ApiNotFoundResponse({ description: 'Category not found.' })
    @ApiForbiddenResponse({ description: 'Forbidden.' })
    @RequirePermissions('utilities:categories')
    deactivate(@Param('id', ParseUUIDPipe) id: string) {
        return this.categoriesService.deactivate(id);
    }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @ApiOperation({ summary: 'Create role', description: 'Creates a new role.' })
  @ApiCreatedResponse({ description: 'The role has been successfully created.', type: Role })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles', description: 'Retrieves a list of all roles.' })
  @ApiOkResponse({ description: 'List of roles.', type: [Role] })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID', description: 'Retrieves a single role by ID.' })
  @ApiOkResponse({ description: 'The role found.', type: Role })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update role', description: 'Updates a role by ID.' })
  @ApiOkResponse({ description: 'The role has been successfully updated.', type: Role })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate role', description: 'Deactivates a role by ID.' })
  @ApiOkResponse({ description: 'The role has been successfully deactivated.' })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  deactivate(@Param('id') id: string) {
    return this.rolesService.deactivate(+id);
  }
}

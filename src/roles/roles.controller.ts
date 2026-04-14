import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @RequirePermissions('utilities:roles')
  @ApiOperation({ summary: 'Create role', description: 'Creates a new role.' })
  @ApiCreatedResponse({ description: 'The role has been successfully created.', type: Role })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @RequirePermissions('utilities:roles')
  @ApiOperation({ summary: 'Get all roles', description: 'Retrieves a list of all roles.' })
  @ApiOkResponse({ description: 'List of roles.', type: [Role] })
  findAll(@Request() req: any) {
    return this.rolesService.findAll(req.user);
  }

  @Get(':id')
  @RequirePermissions('utilities:roles')
  @ApiOperation({ summary: 'Get role by ID', description: 'Retrieves a single role by ID.' })
  @ApiOkResponse({ description: 'The role found.', type: Role })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @RequirePermissions('utilities:roles')
  @ApiOperation({ summary: 'Update role', description: 'Updates a role by ID.' })
  @ApiOkResponse({ description: 'The role has been successfully updated.', type: Role })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Patch(':id/permissions')
  @RequirePermissions('utilities:roles')
  @ApiOperation({ summary: 'Update role permissions', description: 'Updates permissions for a role.' })
  @ApiOkResponse({ description: 'The role permissions have been successfully updated.', type: Role })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  updatePermissions(@Param('id') id: string, @Body('permissions') permissions: string[]) {
    // Only update permissions
    return this.rolesService.update(+id, { permissions });
  }

  @Patch(':id/deactivate')
  @RequirePermissions('utilities:roles')
  @ApiOperation({ summary: 'Deactivate role', description: 'Deactivates a role by ID.' })
  @ApiOkResponse({ description: 'The role has been successfully deactivated.' })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  deactivate(@Param('id') id: string) {
    return this.rolesService.deactivate(+id);
  }

  @Patch(':id/activate')
  @RequirePermissions('utilities:roles')
  @ApiOperation({ summary: 'Activate role', description: 'Activates a role by ID.' })
  @ApiOkResponse({ description: 'The role has been successfully activated.' })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  activate(@Param('id') id: string) {
    return this.rolesService.activate(+id);
  }
}

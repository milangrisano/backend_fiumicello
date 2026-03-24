import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find({ where: { isActive: true } });
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id, isActive: true } });
  }

  async findByName(name: string) {
    return this.roleRepository.findOne({ where: { name, isActive: true } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) throw new NotFoundException('Role not found');
    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async deactivate(id: number) {
    const role = await this.findOne(id);
    if (!role) throw new NotFoundException('Role not found');

    // System roles protection: Cannot deactivate Super Admin or Admin
    if (['Super Admin', 'Admin'].includes(role.name)) {
      throw new ForbiddenException(`Cannot deactivate system role: ${role.name}`);
    }

    role.isActive = false;
    return this.roleRepository.save(role);
  }
}

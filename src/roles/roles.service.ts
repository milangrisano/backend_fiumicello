import { Injectable, OnModuleInit, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  async onModuleInit() {
    await this.seedRoles();
  }

  private async seedRoles() {
    const defaultRoles = [
      { name: 'Super Admin', description: 'System Administrator with full access' },
      { name: 'Admin', description: 'Administrator with managed access' },
      { name: 'Manager', description: 'Has all permissions of Waiter, Cashier, and Chef.' },
      { name: 'Cashier', description: 'Can process any payment (digital/cash). Cannot modify existing orders without Waiter/Manager confirmation.' },
      { name: 'Waiter', description: 'Takes and modifies orders, adds products. Can process digital payments only (no cash).' },
      { name: 'Chef', description: 'Views orders (without prices). Can only update order status: Commanded -> In Progress -> Ready.' },
      { name: 'Guest', description: 'Default role for new users' },
    ];

    for (const roleDto of defaultRoles) {
      const exists = await this.roleRepository.findOne({ where: { name: roleDto.name } });
      if (!exists) {
        await this.roleRepository.save(this.roleRepository.create(roleDto));
        this.logger.log(`Seeded role: ${roleDto.name}`);
      }
    }
  }

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
    if (role) {
      role.isActive = false;
      return this.roleRepository.save(role);
    }
  }
}

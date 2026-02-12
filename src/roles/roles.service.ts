import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
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
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOne({ where: { id } });
  }

  async findByName(name: string) {
    return this.roleRepository.findOne({ where: { name } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    if (role) {
      return this.roleRepository.remove(role);
    }
  }
}

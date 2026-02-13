import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, roleId, restaurantId, ...userData } = createUserDto;
    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Force Guest role
    const role = await this.rolesService.findByName('Guest');
    if (!role) throw new NotFoundException('Default role Guest not found');

    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: role,
      isActive: true, // explicit default
      restaurant: restaurantId ? { id: restaurantId } as any : null,
    });

    const savedUser = await this.userRepository.save(user);
    delete (savedUser as any).password;
    return savedUser;
  }

  async createSuperAdmin(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      return existingUser; // or throw error, but for seeding we might just return it
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const role = await this.rolesService.findByName('Super Admin');
    if (!role) throw new NotFoundException('Super Admin role not found');

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      role: role,
      isActive: true,
      isEmailVerified: true, // Super Admin is trusted
      isPhoneVerified: true,
    });

    const savedUser = await this.userRepository.save(user);
    delete (savedUser as any).password;
    return savedUser;
  }

  findAll() {
    return this.userRepository.find({ relations: ['role'] });
  }

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id }, relations: ['role'] });
  }

  async findByEmail(email: string) {
    // We need password for auth check, so we select it explicitly if needed, 
    // but default findOne excludes it if we configure select: false in entity (which we haven't).
    // For safety, this method returns the full user object including password hash.
    return this.userRepository.findOne({ where: { email }, relations: ['role'] });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Role update restriction: Should ideally be checked at controller/guard level or here.
    // For now, if DTO contains roleId, we allow it (assuming Admin calls this).
    // But strictly speaking, normal users shouldn't be able to update their role.
    if (updateUserDto.roleId) {
      const role = await this.rolesService.findOne(updateUserDto.roleId);
      if (!role) throw new NotFoundException('Role not found');
      user.role = role;
      delete updateUserDto.roleId;
      // Don't delete, just ignore in Object.assign? Or delete to be safe.
    }

    if (updateUserDto.restaurantId) {
      // Assign restaurant relation
      user.restaurant = { id: updateUserDto.restaurantId } as any;
      delete updateUserDto.restaurantId;
    }

    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);
    delete (updatedUser as any).password;
    return updatedUser;
  }


}

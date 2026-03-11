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

    // Force Guest role if no roleId is provided
    let role;
    if (roleId) {
      role = await this.rolesService.findOne(roleId);
      if (!role) throw new NotFoundException(`Role with ID ${roleId} not found`);
    } else {
      role = await this.rolesService.findByName('Guest');
      if (!role) throw new NotFoundException('Default role Guest not found');
    }

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
    return this.userRepository.find({
      where: { isActive: true },
      relations: ['role']
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['role'] });
    if (!user) throw new NotFoundException('User not found');
    if (!user.isActive) throw new NotFoundException('User is inactive');
    return user;
  }

  async deactivate(id: string) {
    const user = await this.findOne(id);
    user.isActive = false;
    const updatedUser = await this.userRepository.save(user);
    delete (updatedUser as any).password;
    return updatedUser;
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

  async updateVerificationCode(email: string, code: string, expiresAt: Date) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    user.emailVerificationCode = code;
    user.emailVerificationCodeExpiresAt = expiresAt;

    await this.userRepository.save(user);
  }

  async verifyEmail(email: string, code: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }

    if (!user.emailVerificationCode || user.emailVerificationCode !== code) {
      return false;
    }

    if (!user.emailVerificationCodeExpiresAt || user.emailVerificationCodeExpiresAt < new Date()) {
      return false;
    }

    user.isEmailVerified = true;
    user.emailVerificationCode = null;
    user.emailVerificationCodeExpiresAt = null;

    await this.userRepository.save(user);
    return true;
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) return false;

    if (!user.emailVerificationCode || user.emailVerificationCode !== code) {
      return false;
    }

    if (!user.emailVerificationCodeExpiresAt || user.emailVerificationCodeExpiresAt < new Date()) {
      return false;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.emailVerificationCode = null;
    user.emailVerificationCodeExpiresAt = null;

    await this.userRepository.save(user);
    return true;
  }

  async deleteAllUsers() {
    const query = this.userRepository.createQueryBuilder('user');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      // Typically need to handle foreign-keys, but for dev seed it should be okay if cascade handles it, 
      // or if nothing references user. Let's log it if it fails:
      console.error('Error deleting users:', error);
      throw error;
    }
  }

}

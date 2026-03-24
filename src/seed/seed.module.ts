import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [ProductsModule, UsersModule, RolesModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule { }

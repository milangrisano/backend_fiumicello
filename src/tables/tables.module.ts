import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { Table } from './entities/table.entity';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Table, Restaurant]),
        AuthModule,
    ],
    controllers: [TablesController],
    providers: [TablesService],
    exports: [TablesService],
})
export class TablesModule { }

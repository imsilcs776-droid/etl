import { Module } from '@nestjs/common';
import { RolesService } from './role.service';
import { RolesController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { RolesPEOService } from './role-peo.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Role]), SyncLogsModule],
  controllers: [RolesController],
  providers: [RolesService, RolesPEOService],
  exports: [RolesService, RolesPEOService],
})
export class RolesModule {}

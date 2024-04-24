import { Module } from '@nestjs/common';
import { DepartmentsService } from './department.service';
import { DepartmentsController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { DepartmentsParentService } from './department-parent.service';
import { DepartmentMDMService } from './department-mdm.service';
import { DepartmentsdetachedService } from './department-detached.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Department]), SyncLogsModule],
  controllers: [DepartmentsController],
  providers: [
    DepartmentsService,
    DepartmentsParentService,
    DepartmentMDMService,
    DepartmentsdetachedService,
  ],
  exports: [
    DepartmentsService,
    DepartmentsParentService,
    DepartmentMDMService,
    DepartmentsdetachedService,
  ],
})
export class DepartmentsModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlhUserDepartmentsController } from './department.controller';
import { PlhUserDepartmentsService } from './department.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { DepartmentMvEntity } from 'src/peo-department/entities/department.mv.entity';
import { DivisiPeoEntity } from 'src/peo-department/entities/divisi.peo.entity';
import { UserMvEntity } from 'src/peo-user/entities/user.mv.entity';
import { PlhPeoEntity } from 'src/sink-plh/entities/plh.peo.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      DepartmentMvEntity,
      DivisiPeoEntity,
      PlhPeoEntity,
      UserMvEntity,
    ]),
    SyncLogsModule,
  ],
  controllers: [PlhUserDepartmentsController],
  providers: [PlhUserDepartmentsService],
  exports: [PlhUserDepartmentsService],
})
export class PeoPlhUserDepartmentsModule {}

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DepartmentsController } from './department.controller';
import { DepartmentsService } from './department.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentMvEntity } from './entities/department.mv.entity';
import { DivisiPeoEntity } from './entities/divisi.peo.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([DepartmentMvEntity, DivisiPeoEntity]),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService],
  exports: [DepartmentsService],
})
export class PeoDepartmentsModule {}

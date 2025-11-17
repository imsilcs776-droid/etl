import { Module } from '@nestjs/common';
import { DivisiByPLHController } from './divisi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisiPeoEntity } from 'src/peo-department/entities/divisi.peo.entity';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { DivisiByPLHPeoService } from './divisi-peo.service';
import { CompaniesMvEntity } from 'src/mv-company/entities/companies.mv.entity';
import { CompanyMvModule } from 'src/mv-company/mv-company.module';
import { DivisiByPLHService } from './divisi.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([DivisiPeoEntity, CompaniesMvEntity]),
    SyncLogsModule,
    CompanyMvModule,
  ],
  controllers: [DivisiByPLHController],
  providers: [DivisiByPLHService, DivisiByPLHPeoService],
  exports: [DivisiByPLHService, DivisiByPLHPeoService],
})
export class DivisiByPLHModule { }

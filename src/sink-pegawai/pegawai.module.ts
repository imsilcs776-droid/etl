import { Module } from '@nestjs/common';
import { PegawaiService } from './pegawai.service';
import { PegawaiController } from './pegawai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { PegawaiPeoService } from './pegawai-peo.service';
import { RolePeoEntity } from 'src/peo-role/entity/role.peo.entity';
import { CompanyMvModule } from 'src/mv-company/mv-company.module';
import { CompaniesMvEntity } from 'src/mv-company/entities/companies.mv.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([RolePeoEntity, CompaniesMvEntity]),
    SyncLogsModule,
    CompanyMvModule,
  ],
  controllers: [PegawaiController],
  providers: [PegawaiService, PegawaiPeoService],
  exports: [PegawaiService, PegawaiPeoService],
})
export class SinkPegawaiModule {}

import { Module } from '@nestjs/common';
import { AtasanBawahanService } from './atasan-bawahan.service';
import { AtasanBawahanController } from './atasan-bawahan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { AtasanBawahanPeoService } from './atasan-bawahan-peo.service';
import { AtasanBawahanPeoEntity } from 'src/peo-user/entities/atasan-bawahan.peo.entity';
import { CompaniesMvEntity } from 'src/mv-company/entities/companies.mv.entity';
import { CompanyMvModule } from 'src/mv-company/mv-company.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([AtasanBawahanPeoEntity, CompaniesMvEntity]),
    SyncLogsModule,
    CompanyMvModule,
  ],
  controllers: [AtasanBawahanController],
  providers: [AtasanBawahanService, AtasanBawahanPeoService],
  exports: [AtasanBawahanService, AtasanBawahanPeoService],
})
export class SinkAtasanBawahanModule { }

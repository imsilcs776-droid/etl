import { Module } from '@nestjs/common';
import { DivisiService } from './divisi.service';
import { DivisiController } from './divisi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisiPeoEntity } from 'src/peo-department/entities/divisi.peo.entity';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { DivisiPeoService } from './divisi-peo.service';
import { CompaniesMvEntity } from 'src/mv-company/entities/companies.mv.entity';
import { CompanyMvModule } from 'src/mv-company/mv-company.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([DivisiPeoEntity, CompaniesMvEntity]),
    SyncLogsModule,
    CompanyMvModule,
  ],
  controllers: [DivisiController],
  providers: [DivisiService, DivisiPeoService],
  exports: [DivisiService, DivisiPeoService],
})
export class SinkDivisiModule {}

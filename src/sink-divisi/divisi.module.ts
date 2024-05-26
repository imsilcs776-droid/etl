import { Module } from '@nestjs/common';
import { DivisiService } from './divisi.service';
import { DivisiController } from './divisi.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DivisiPeoEntity } from 'src/peo-department/entities/divisi.peo.entity';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { DivisiPeoService } from './divisi-peo.service';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([DivisiPeoEntity]),
    SyncLogsModule,
  ],
  controllers: [DivisiController],
  providers: [DivisiService, DivisiPeoService],
  exports: [DivisiService, DivisiPeoService],
})
export class DivisiModule {}

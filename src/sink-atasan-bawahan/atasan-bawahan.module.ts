import { Module } from '@nestjs/common';
import { AtasanBawahanService } from './atasan-bawahan.service';
import { AtasanBawahanController } from './atasan-bawahan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { AtasanBawahanPeoService } from './atasan-bawahan-peo.service';
import { AtasanBawahanPeoEntity } from 'src/peo-user/entities/atasan-bawahan.peo.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([AtasanBawahanPeoEntity]),
    SyncLogsModule,
  ],
  controllers: [AtasanBawahanController],
  providers: [AtasanBawahanService, AtasanBawahanPeoService],
  exports: [AtasanBawahanService, AtasanBawahanPeoService],
})
export class SinkAtasanBawahanModule {}

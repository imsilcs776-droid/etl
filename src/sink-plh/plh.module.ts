import { Module } from '@nestjs/common';
import { PlhService } from './plh.service';
import { PlhController } from './plh.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { PlhPeoService } from './plh-peo.service';
import { PlhPeoEntity } from './entities/plh.peo.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([PlhPeoEntity]),
    SyncLogsModule,
  ],
  controllers: [PlhController],
  providers: [PlhService, PlhPeoService],
  exports: [PlhService, PlhPeoService],
})
export class SinkPlhModule {}

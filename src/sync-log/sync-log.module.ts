import { Module } from '@nestjs/common';
import { SyncLogsService } from './sync-log.service';
import { SyncLogsController } from './sync-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SyncLog } from './entities/sync-log.entity';
import { SyncFailedLog } from './entities/sync-failed-log.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([SyncLog, SyncFailedLog])],
  controllers: [SyncLogsController],
  providers: [SyncLogsService],
  exports: [
    SyncLogsService,
    TypeOrmModule.forFeature([SyncLog, SyncFailedLog]),
  ],
})
export class SyncLogsModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncLog } from './entities/sync-log.entity';
import { CreateSyncLogDto } from './dto/create-sync-log.dto';
import { SyncFailedLog } from './entities/sync-failed-log.entity';
import { CreateSyncFailedLogDto } from './dto/create-sync-failed-log.dto';

@Injectable()
export class SyncLogsService {
  constructor(
    @InjectRepository(SyncLog)
    private syncLogRepository: Repository<SyncLog>,
    @InjectRepository(SyncFailedLog)
    private syncFailedLogRepository: Repository<SyncFailedLog>,
  ) {}

  async addLog(synLogDto: CreateSyncLogDto) {
    await this.syncLogRepository.upsert(synLogDto, ['code']);
  }

  async addFailedLog(CreateSyncFailedLogDto: CreateSyncFailedLogDto) {
    await this.syncFailedLogRepository.insert(CreateSyncFailedLogDto);
  }
}

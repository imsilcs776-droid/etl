import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SyncLog } from './entities/sync-log.entity';
import { CreateSyncLogDto } from './dto/create-sync-log.dto';
import { SyncFailedLog } from './entities/sync-failed-log.entity';
import { CreateSyncFailedLogDto } from './dto/create-sync-failed-log.dto';
import * as moment from 'moment';

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

  async startLog() {
    const now = moment().utcOffset('+0700').toDate();
    const newLog: CreateSyncLogDto = {
      code: 'START_SYNC',
      updated_at: now,
    };
    await this.syncLogRepository.upsert(newLog, ['code']);
  }

  async endLog() {
    const now = moment().utcOffset('+0700').toDate();
    const newLog: CreateSyncLogDto = {
      code: 'END_SYNC',
      updated_at: now,
    };
    await this.syncLogRepository.upsert(newLog, ['code']);
  }

  async isProcessing() {
    const [start, end] = await this.syncLogRepository.find({
      where: {
        code: In(['START_SYNC', 'END_SYNC']),
      },
      order: {
        id: 'ASC',
      },
    });

    const startTime = new Date(start?.updated_at);
    const endTime = new Date(end?.updated_at);

    if (startTime > endTime) {
      return {
        isProcessing: true,
        startTime,
        endTime,
        start,
        end,
      };
    }

    return {
      isProcessing: false,
      startTime,
      endTime,
      start,
      end,
    };
  }
}

import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { SyncLogsService } from './sync-log.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateSyncLogDto } from './dto/create-sync-log.dto';
import { CreateSyncFailedLogDto } from './dto/create-sync-failed-log.dto';

@ApiTags('Sync SyncLog')
@Controller({
  path: 'sync-logs',
})
export class SyncLogsController {
  constructor(private readonly SyncLogsService: SyncLogsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll(@Body() createSyncLogDto: CreateSyncLogDto) {
    return await this.SyncLogsService.addLog(createSyncLogDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findfailAll(@Body() createSyncFailedLogDto: CreateSyncFailedLogDto) {
    return await this.SyncLogsService.addFailedLog(createSyncFailedLogDto);
  }
}

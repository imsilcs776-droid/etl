import { Module } from '@nestjs/common';
import { JobsService } from './job.service';
import { JobsController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { JobMDMService } from './job-mdm.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Job]), SyncLogsModule],
  controllers: [JobsController],
  providers: [JobsService, JobMDMService],
  exports: [JobsService, JobMDMService],
})
export class JobsModule {}

import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { JobsService } from './job.service';
// import { CreateJobDto } from './dto/create-Job.dto';
// import { UpdateJobDto } from './dto/update-Job.dto';
import { ApiTags } from '@nestjs/swagger';
import { JobMDMService } from './job-mdm.service';

@ApiTags('Sync Job')
@Controller({
  path: 'sync-job',
})
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly jobsMDMService: JobMDMService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.jobsService.processJob();
  }

  @Get('mdm/jobs')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    // @Query('lastSync') lastSync?: Date,
  ) {
    return await this.jobsMDMService.getJob({
      page,
      limit,
      // lastSync,
    });
  }
}

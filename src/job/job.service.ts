import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { delay } from 'src/utils/delay';
import { CreateJobDto } from './dto/create-job.dto';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { JobMDMService } from './job-mdm.service';

@Injectable()
export class JobsService {
  private axiosOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    json: true,
    auth: {
      username: 'admin',
      password: '1234',
    },
    method: 'post',
    url: '',
    data: {},
  };

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    private syncLogService: SyncLogsService,
    private readonly httpService: HttpService,
    private jobMDMService: JobMDMService,
  ) {}

  public async processJob() {
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const departments = await this.getJobs({
        page,
        limit,
      });
      if (departments && departments.length) {
        await this.bulkInsert(departments);
      } else {
        stop = true;
      }
      page++;
    }

    const processedJob = await this.jobRepository.count({
      where: { source: 'IMS_INTEGRATION' },
    });
    const syncData = await this.syncLogService.addLog({
      code: await this.jobRepository.metadata.tableName.toString(),
      updated_at: new Date(),
    });
    return { syncData, total: processedJob };
  }

  async bulkInsert(jobs = []) {
    let count = 0;

    while (count < jobs.length) {
      const { SHORT, PLANS, WERKS_NEW, LAST_UPDATED_DATE, CREATED_DATE } =
        jobs[count];

      const body = new Job();
      body.code = SHORT;
      body.name = PLANS;
      body.description = PLANS;
      body.is_active = true;
      body.updated_at = new Date(LAST_UPDATED_DATE);
      body.created_at = new Date(CREATED_DATE);
      body.source = 'IMS_INTEGRATION';
      body.i_com_code = WERKS_NEW;
      body.i_objid = SHORT;

      await this.create(body);
      count++;
    }

    return true;
  }

  async create(createJobDto: CreateJobDto) {
    /**
     * save deparment or update
     */
    return await this.jobRepository.upsert(createJobDto, ['i_objid']);
  }

  /**
   * get job
   * @param {
   *  page, limit, objid
   * }
   * @returns {OBJID,PARID,CREATED_DATE,LAST_UPDATED_DATE,COMPANY_CODE,STEXT}
   */
  async getJobs({ page, limit }): Promise<any> {
    return await this.jobMDMService.getJob({ page, limit });
  }
}

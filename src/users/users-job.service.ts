import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Not, Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { User } from './entities/user.entity';
import { Job } from 'src/job/entities/job.entity';

@Injectable()
export class UserJobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private syncLogService: SyncLogsService, // @InjectConnection('mdm') private readonly connection: Connection,
  ) {}

  public async processAccountjob() {
    const limit = 500;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      console.log('PAGE=>', page);
      const userJob = await this.updateUser({
        page,
        limit,
      });
      if (userJob.length === 0) {
        stop = true;
      }
      page++;
    }

    const processedAccount = await this.userRepository.count({
      where: { nip: Not(IsNull()) },
    });
    const syncData = await this.syncLogService.addLog({
      code: await this.userRepository.metadata.tableName.toString(),
      updated_at: new Date(),
    });
    return { syncData, total: processedAccount };
  }

  private async updateUser({ page, limit: take }) {
    const skip = (page - 1) * take;
    const account = await this.userRepository.find({
      take,
      skip,
      select: ['id', 'i_job_code'],
      where: {
        nip: Not(IsNull()),
      },
      order: {
        nip: 'ASC',
      },
    });

    let count = 0;
    while (count < account.length) {
      const { id } =
        (await this.jobRepository.findOne({
          where: {
            i_objid: account[count].i_job_code,
          },
        })) || {};

      await this.userRepository
        .createQueryBuilder()
        .update()
        .set({ job: id })
        .where('id = :idJob', { idJob: account[count].id })
        .execute();
      count++;
    }

    return account;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Not, Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { Department } from 'src/department/entities/department.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserDepartmentService {
  constructor(
    @InjectRepository(Department)
    private departMentrepository: Repository<Department>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private syncLogService: SyncLogsService, // @InjectConnection('mdm') private readonly connection: Connection,
  ) {}

  public async processAccountdepartment() {
    const limit = 500;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const userDepartment = await this.updateUser({
        page,
        limit,
      });
      if (userDepartment.length === 0) {
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
      select: ['id', 'i_department_code'],
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
        (await this.departMentrepository.findOne({
          where: {
            i_objid: account[count].i_department_code,
          },
        })) || {};

      await this.userRepository
        .createQueryBuilder()
        .update()
        .set({ department: id })
        .where('id = :idDep', { idDep: account[count].id })
        .execute();
      count++;
    }

    return account;
  }
}

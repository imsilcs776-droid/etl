import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { delay } from 'src/utils/delay';
import { SyncLogsService } from 'src/sync-log/sync-log.service';

@Injectable()
export class DepartmentsParentService {
  constructor(
    @InjectRepository(Department)
    private repository: Repository<Department>,
    private syncLogService: SyncLogsService,
  ) {}

  public async processDepartmentParent() {
    const limit = 500;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const departmentsParent = await this.updateEachParent({
        page,
        limit,
      });
      if (departmentsParent.length === 0) {
        stop = true;
      }
      page++;
    }

    const processedDepartment = await this.repository.count({
      where: { source: 'IMS_INTEGRATION' },
    });
    const syncData = await this.syncLogService.addLog({
      code: await this.repository.metadata.tableName.toString(),
      updated_at: new Date(),
    });
    return { syncData, total: processedDepartment };
  }

  private async updateEachParent({ page, limit: take }) {
    const skip = (page - 1) * take;
    const deparment = await this.repository.find({
      take,
      skip,
      select: ['id', 'i_parid'],
      where: {
        source: 'IMS_INTEGRATION',
        parent: IsNull(),
        i_parid: Not(IsNull()),
      },
      order: {
        id: 'ASC',
      },
    });

    let count = 0;
    while (count < deparment.length) {
      const { id } =
        (await this.repository.findOne({
          where: {
            i_objid: deparment[count].i_parid,
          },
        })) || {};

      await this.repository
        .createQueryBuilder()
        .update()
        .set({ parent: id })
        .where('id = :idDep', { idDep: deparment[count].id })
        .execute();
      count++;
    }

    return deparment;
  }
}

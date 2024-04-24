import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { delay } from 'src/utils/delay';
import { SyncLogsService } from 'src/sync-log/sync-log.service';

@Injectable()
export class DepartmentsdetachedService {
  constructor(
    @InjectRepository(Department)
    private repository: Repository<Department>,
    private syncLogService: SyncLogsService,
  ) {}

  public async processDepartmentDetach() {
    try {
      const { i_updated_at } =
        (await this.repository.findOne({
          select: ['i_updated_at'],
          where: {
            deleted_at: IsNull(),
            i_updated_at: Not(IsNull()),
          },
          order: {
            i_updated_at: 'DESC',
          },
        })) || {};

      if (!i_updated_at) throw new Error('no department found');

      const today = new Date(i_updated_at).toLocaleDateString();

      const result = await this.repository
        .createQueryBuilder()
        .update()
        .set({ deleted_at: new Date() })
        .where('DATE(i_updated_at) < :today', { today })
        .execute();

      const resultUpdate = await this.repository
        .createQueryBuilder()
        .update()
        .set({ deleted_at: null })
        .where('DATE(i_updated_at) = :today', { today })
        .execute();

      return { result, resultUpdate };
    } catch (e) {
      throw e;
    }
  }
}

import { Injectable, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import * as moment from 'moment';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { PlhPeoEntity } from 'src/sink-plh/entities/plh.peo.entity';
import { UserMvEntity } from 'src/peo-user/entities/user.mv.entity';
import { DepartmentMvEntity } from 'src/peo-department/entities/department.mv.entity';

@Injectable()
export class PlhUserDepartmentsService {
  constructor(
    @InjectRepository(DepartmentMvEntity)
    private repositoryDepartmentMv: Repository<DepartmentMvEntity>,
    @InjectRepository(UserMvEntity)
    private repositoryUserMv: Repository<UserMvEntity>,
    @InjectRepository(PlhPeoEntity)
    private repositoryPeoPlhUserDept: Repository<PlhPeoEntity>,
    private syncLogService: SyncLogsService,
  ) { }

  public async processPlhUserDepartment() {
    const now = moment().toDate();
    const limit = 100;
    let stop = false;
    let page = 1;

    const version = 2;

    while (!stop) {
      await delay(500);
      const peoDivs = await this.getPeoMvPlh({
        page,
        limit,
      });
      if (peoDivs && peoDivs.length) {
        await this.bulkInsert(peoDivs, version);
      } else {
        stop = true;
      }
      page++;
    }

    let totalDeleted = 0

    /**
     * add new last log
     */
    this.syncLogService.addLog({
      updated_at: now,
      code: 'peo_plh_user_departments',
    });
    return {
      lastInactive: totalDeleted,
    };
  }


  private async bulkInsert(plh: PlhPeoEntity[], version) {
    const now = moment().toDate();
    const stringEndda = '9999-12-31 00:00:00';

    const nippPlhList = [...new Set(plh.map(p => p.nipp_plh.trim()))];

    const users = await this.repositoryUserMv.find({
      where: { nip_new: In(nippPlhList) },
    });
    const userMap = new Map(users.map(user => [user.nip_new.trim(), user.id]));


    for (const peoPeoPlh of plh) {
      const dept = await this.repositoryDepartmentMv.findOne({
        where: { i_kd_wil: peoPeoPlh.kd_wil, code: peoPeoPlh.kd_div },
      });

      const body: Partial<PlhPeoEntity> = {
        user_plh_id: userMap.get(peoPeoPlh.nipp_plh.trim()) || null,
        dept_pejabat_id: dept?.id || null,
        updated_at: now,
      };

      await this.repositoryPeoPlhUserDept.update(peoPeoPlh.id, body);
    }

    return true;
  }

  private async getPeoMvPlh({ page, limit }): Promise<PlhPeoEntity[]> {
    try {
      const offset = limit * (page - 1);
      const departments = await this.repositoryPeoPlhUserDept
        .createQueryBuilder('peo_plh')
        .leftJoin(
          qb => qb
            .select('MAX(updated_at)', 'last')
            .from('ims_sync_logs', 'logs')
            .where('logs.code = :code', { code: 'peo_plh_user_departments' }),
          'sync',
          '1=1'
        )
        // updated_at MUST NOT be NULL
        .where('peo_plh.updated_at IS NOT NULL')
        // if sync.last NULL → ambil semua (karena belum pernah sync)
        // otherwise compare updated_at > sync.last
        .andWhere('(sync.last IS NULL OR peo_plh.updated_at > sync.last)')
        .orderBy('peo_plh.id', 'ASC')
        .offset(offset)
        .limit(limit)
        .getMany();

      return departments;
    } catch (err) {
      console.log(err);
    }
  }
}

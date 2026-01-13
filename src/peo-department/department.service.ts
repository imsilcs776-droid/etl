import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { DepartmentMvEntity } from './entities/department.mv.entity';
import { DivisiPeoEntity } from './entities/divisi.peo.entity';
import * as moment from 'moment';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { SyncLogsService } from 'src/sync-log/sync-log.service';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(DepartmentMvEntity)
    private repositoryDepartmentMv: Repository<DepartmentMvEntity>,
    @InjectRepository(DivisiPeoEntity)
    private repositoryDivisiPeo: Repository<DivisiPeoEntity>,
    private syncLogService: SyncLogsService,
  ) {}

  public async processDepartment() {
    const now = moment().toDate();
    const limit = 100;
    let stop = false;
    let page = 1;

    const version = 2;

    while (!stop) {
      await delay(500);
      const peoDivs = await this.getDivisions({
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

    let totalDeleted = 0;
    totalDeleted = await this.setDeletedDepartments();

    const processedDepartment = await this.repositoryDepartmentMv.count({
      where: { source: 'PEO', is_active: true },
    });

    const totalInactive = await this.repositoryDepartmentMv.count({
      where: { is_active: false },
    });

    const totalPlhActive = await this.setPlhActiveDepartments();

    /**
     * add new last log
     */
    this.syncLogService.addLog({
      updated_at: now,
      code: 'mt_departments',
    });
    return {
      totalActive: processedDepartment,
      totalInactive,
      lastInactive: totalDeleted,
      totalPlhActive,
    };
  }

  public async processedUpdateParent() {
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const departments = await this.getDepartments({
        page,
        limit,
      });
      if (departments && departments.length) {
        await this.updateParent(departments);
      } else {
        stop = true;
      }
      page++;
    }
  }

  private async updateParent(departments: CreateDepartmentDto[]) {
    for (const department of departments) {
      if (department.i_parent) {
        // console.log('i_parent', department.i_parent);
        const parList = department.i_parent.split(';');
        parList.shift();
        const [myParent] = parList || [];
        if (myParent) {
          const parent = await this.repositoryDepartmentMv.findOne({
            where: {
              code: myParent,
              is_active: true,
              i_kd_wil: department.i_kd_wil,
            },
          });

          if (parent) {
            await this.repositoryDepartmentMv
              .createQueryBuilder()
              .update(DepartmentMvEntity)
              .set({ parent: parent.id })
              .where('id = :id', { id: department.id })
              .execute();
          }
        }
      }
    }
  }

  private async bulkInsert(divisions: DivisiPeoEntity[], version) {
    const now = moment().toDate();
    const stringEndda = '9999-12-31 00:00:00';
    const endda = moment(stringEndda).toDate();

    for (const peoDiv of divisions) {
      const existingRecord = await this.repositoryDepartmentMv.findOne({
        where: {
          i_kd_wil: peoDiv.kd_wil_arsip,
          code: peoDiv.kd_div_arsip,
        },
      });

      if (existingRecord) {
        const body = {
          description: peoDiv.nama_dir,
          is_active: true,
          name: peoDiv.nama_dir,
          updated_at: now,
          source: 'PEO',
          i_com_code: peoDiv.werks_new,
          i_level_organisasi: Number(peoDiv.jenis || null),
          i_updated_at: now,
          i_endda: endda,
          i_version: version,
          i_parent: peoDiv.parent,
          instansi: peoDiv.grup,
          code: peoDiv.kd_div_arsip,
          i_kd_wil: peoDiv.kd_wil_arsip,
          i_nama_cabang: peoDiv.nama_cabang,
        };

        // console.log(body);

        await this.repositoryDepartmentMv.update(existingRecord.id, body);
      } else {
        const body = new DepartmentMvEntity();
        body.code = peoDiv.kd_div_arsip;
        body.created_at = now;
        body.description = peoDiv.nama_dir;
        body.is_active = true;
        body.name = peoDiv.nama_dir;
        body.updated_at = now;
        body.source = 'PEO';
        body.i_com_code = peoDiv.werks_new;
        body.i_level_organisasi = Number(peoDiv.jenis || null);
        body.i_updated_at = now;
        body.i_endda = endda;
        body.i_version = version;
        body.i_kd_wil = peoDiv.kd_wil_arsip;
        body.i_parent = peoDiv.parent;
        body.instansi = peoDiv.grup;
        body.i_nama_cabang = peoDiv.nama_cabang;
        await this.repositoryDepartmentMv.insert(body);
      }
    }

    return true;
  }

  private async getDivisions({ page, limit }): Promise<DivisiPeoEntity[]> {
    try {
      const offset = limit * (page - 1);
      const departments = await this.repositoryDivisiPeo
        .createQueryBuilder('peo_divisi')
        .leftJoin(
          (qb) =>
            qb
              .select('MAX(updated_at)', 'last')
              .from('ims_sync_logs', 'logs')
              .where('logs.code = :code', { code: 'mt_departments' }),
          'sync',
          '1=1',
        )
        // updated_at MUST NOT be NULL
        .where('peo_divisi.updated_at IS NOT NULL')
        // if sync.last NULL → ambil semua (karena belum pernah sync)
        // otherwise compare updated_at > sync.last
        .andWhere('(sync.last IS NULL OR peo_divisi.updated_at > sync.last)')
        .orderBy('peo_divisi.id', 'ASC')
        .offset(offset)
        .limit(limit)
        .setParameter('code', 'mt_departments')
        .getMany();

      return departments;
    } catch (err) {
      console.log(err);
    }
  }

  private async getDepartments({ page, limit }): Promise<DepartmentMvEntity[]> {
    try {
      const offset = limit * (page - 1);
      return await this.repositoryDepartmentMv.find({
        skip: offset,
        take: limit,
        order: { id: 'ASC' },
        where: {
          is_active: true,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * set deleted departments
   * ketikan ada mv_department yang updated_at nya kurang dari updated_at terakhir di peo_divisi
   * @returns true
   */
  private async setDeletedDepartments(): Promise<number> {
    try {
      const result = await this.repositoryDepartmentMv
        .createQueryBuilder()
        .update('mt_departments')
        .set({ is_active: false })
        .where(
          `COALESCE(mt_departments.updated_at, '1970-01-01') < (SELECT MAX(updated_at) FROM peo_divisi)`,
        )
        .execute();

      const affectedRows = result.affected || 0; // Get the count of affected rows

      console.log(`Number of rows updated to is_active false: ${affectedRows}`);

      return affectedRows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * set deleted departments
   * ketikan ada mv_department yang updated_at nya kurang dari updated_at terakhir di peo_divisi
   * @returns true
   */
  private async setPlhActiveDepartments(): Promise<number> {
    try {
      const result = await this.repositoryDepartmentMv
        .createQueryBuilder()
        .update('mt_departments')
        .set({ is_active: true })
        .where('mt_departments.is_active = false')
        .andWhere(
          `mt_departments.id IN(
            SELECT
              l.id
            FROM
              mt_departments l
              INNER JOIN peo_plh r ON l.code = r.kd_div
              AND l.i_kd_wil = r.kd_wil
            GROUP BY
              l.id
            HAVING
              COUNT(r.id) > 0
          )`,
        )
        .execute();

      const affectedRows = result.affected || 0; // Get the count of affected rows

      console.log(`Number of rows updated to is_active false: ${affectedRows}`);

      return affectedRows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

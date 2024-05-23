import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { DepartmentMvEntity } from './entities/department.mv.entity';
import { DivisiPeoEntity } from './entities/divisi.peo.entity';
import * as moment from 'moment';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(DepartmentMvEntity)
    private repositoryDepartmentMv: Repository<DepartmentMvEntity>,
    @InjectRepository(DivisiPeoEntity)
    private repositoryDivisiPeo: Repository<DivisiPeoEntity>,
    private readonly connection: Connection,
  ) {}

  public async processDepartment() {
    const limit = 100;
    let stop = false;
    let page = 1;

    const version = 1;

    while (!stop) {
      await delay(500);
      const departments = await this.getDepartments({
        page,
        limit,
      });
      if (departments && departments.length) {
        await this.bulkInsert(departments, version);
      } else {
        stop = true;
      }
      page++;
    }

    await this.processedUpdateParent();

    const processedDepartment = await this.repositoryDepartmentMv.count({
      where: { source: 'PEO', is_active: true },
    });
    return { total: processedDepartment };
  }

  private async processedUpdateParent() {
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

  private async updateParent(departments) {
    for (const department of departments) {
      const parent = await this.repositoryDepartmentMv.findOne({
        where: { code: department.kd_induk },
      });

      if (parent) {
        await this.repositoryDepartmentMv
          .createQueryBuilder()
          .update(DepartmentMvEntity)
          .set({ parent: parent.id })
          .where('code = :code', { code: department.kd_div_arsip })
          .andWhere('is_active = :is_active', { is_active: true })
          .execute();
      }
    }
  }

  private async bulkInsert(departments: DivisiPeoEntity[], version) {
    const now = moment().toDate();
    const stringEndda = '9999-12-31 00:00:00';
    const endda = moment(stringEndda).toDate();

    for (const department of departments) {
      const existingRecord = await this.repositoryDepartmentMv.findOne({
        where: {
          i_kd_wil: department.kd_wil_arsip,
          code: department.kd_div_arsip,
        },
      });

      if (existingRecord) {
        await this.repositoryDepartmentMv.update(existingRecord.id, {
          description: department.nama_dir,
          is_active: true,
          name: department.nama_dir,
          updated_at: now,
          source: 'PEO',
          // i_com_code: department.kd_wil_arsip,
          i_level_organisasi: Number(department.jenis || null),
          i_updated_at: now,
          i_endda: endda,
          i_version: version,
          instansi:
            department.instansi === 'PLTP'
              ? 'SPTP'
              : department.instansi === 'PLND'
              ? 'PELINDO'
              : department.instansi,
          code: department.kd_div_arsip,
          i_kd_wil: department.kd_wil_arsip,
        });
      } else {
        const body = new DepartmentMvEntity();
        body.code = department.kd_div_arsip;
        body.created_at = now;
        body.description = department.nama_dir;
        body.is_active = true;
        body.name = department.nama_dir;
        body.updated_at = now;
        body.source = 'PEO';
        // body.i_com_code = department.kd_wil_arsip;
        body.i_level_organisasi = Number(department.jenis || null);
        body.i_updated_at = now;
        body.i_endda = endda;
        body.i_version = version;
        body.i_kd_wil = department.kd_wil_arsip;
        body.instansi =
          department.instansi === 'PLTP'
            ? 'SPTP'
            : department.instansi === 'PLND'
            ? 'PELINDO'
            : department.instansi;
        await this.repositoryDepartmentMv.insert(body);
      }
    }

    return true;
  }

  private async getDepartments({ page, limit }): Promise<DivisiPeoEntity[]> {
    try {
      const offset = limit * (page - 1);
      return await this.repositoryDivisiPeo.find({
        skip: offset,
        take: limit,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

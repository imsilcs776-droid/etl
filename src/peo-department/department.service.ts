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

    let version = 1;
    const checkVersion = await this.repositoryDepartmentMv
      .createQueryBuilder('department')
      .orderBy('department.created_at')
      .getOne();

    if (checkVersion) {
      version = checkVersion.i_version + 1;
    }

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

  private async bulkInsert(departments = [], version) {
    const now = moment().toDate();
    const stringEndda = '9999-12-31 00:00:00';
    const endda = moment(stringEndda).toDate();

    for (const department of departments) {
      // update existing data
      // const existDepartment = await this.repositoryDepartmentMv.findOne({
      //   where: { code: department.kd_div_arsip },
      // });

      // if (existDepartment) {
      //   const updateDepartment = {
      //     is_active: false,
      //     i_endda: now,
      //   };
      //   await this.repositoryDepartmentMv.update(
      //     existDepartment.id,
      //     updateDepartment,
      //   );
      // }

      const body = new DepartmentMvEntity();
      body.code = department.kd_div_arsip;
      body.created_at = now;
      body.description = department.nama_dir;
      body.is_active = true;
      body.name = department.nama_dir;
      body.updated_at = now;
      body.source = 'PEO';
      body.i_com_code = department.kd_wil_arsip;
      body.i_level_organisasi = department.jenis;
      body.i_updated_at = now;
      body.i_endda = endda;
      body.i_version = version;
      body.i_kd_sub = department.kd_sub;

      // await this.repositoryDepartmentMv.insert(body);
      await this.upsertDepartment(body, version);
    }

    return true;
  }

  async upsertDepartment(department: any, version): Promise<void> {
    const now = new Date();
    const endda = new Date('9999-12-31'); // Assuming this is your default end date

    const existingRecord = await this.repositoryDepartmentMv.findOne({
      where: {
        i_kd_sub: department.i_kd_sub,
        code: department.code,
      },
    });

    if (existingRecord) {
      await this.repositoryDepartmentMv.update(existingRecord.id, {
        description: department.nama_dir,
        is_active: true,
        name: department.nama_dir,
        updated_at: now,
        source: 'PEO',
        i_com_code: department.kd_wil_arsip,
        i_level_organisasi: department.jenis,
        i_updated_at: now,
        i_endda: endda,
        i_version: version,
      });
    } else {
      const newRecord = new DepartmentMvEntity();
      newRecord.code = department.kd_div_arsip;
      newRecord.created_at = now;
      newRecord.description = department.nama_dir;
      newRecord.is_active = true;
      newRecord.name = department.nama_dir;
      newRecord.updated_at = now;
      newRecord.source = 'PEO';
      newRecord.i_com_code = department.kd_wil_arsip;
      newRecord.i_level_organisasi = department.jenis;
      newRecord.i_updated_at = now;
      newRecord.i_endda = endda;
      newRecord.i_version = version;
      newRecord.i_kd_sub = department.kd_sub;

      await this.repositoryDepartmentMv.insert(newRecord);
    }

    return;
  }

  private async getDepartments({ page, limit }): Promise<any> {
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

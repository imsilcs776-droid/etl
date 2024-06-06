import { Injectable, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { DepartmentMvEntity } from './entities/department.mv.entity';
import { DivisiPeoEntity } from './entities/divisi.peo.entity';
import * as moment from 'moment';
import { CreateDepartmentDto } from './dto/create-department.dto';

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

    // await this.processedUpdateParent();

    const processedDepartment = await this.repositoryDepartmentMv.count({
      where: { source: 'PEO', is_active: true },
    });
    return { total: processedDepartment };
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
            where: { code: myParent },
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
          // i_com_code: peoDiv.kd_wil_arsip,
          i_level_organisasi: Number(peoDiv.jenis || null),
          i_updated_at: now,
          i_endda: endda,
          i_version: version,
          i_parent: peoDiv.parent,
          instansi:
            peoDiv.instansi === 'PLTP'
              ? 'SPTP'
              : peoDiv.instansi === 'PLND'
              ? 'PELINDO'
              : peoDiv.instansi,
          code: peoDiv.kd_div_arsip,
          i_kd_wil: peoDiv.kd_wil_arsip,
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
        // body.i_com_code = peoDiv.kd_wil_arsip;
        body.i_level_organisasi = Number(peoDiv.jenis || null);
        body.i_updated_at = now;
        body.i_endda = endda;
        body.i_version = version;
        body.i_kd_wil = peoDiv.kd_wil_arsip;
        body.i_parent = peoDiv.parent;
        body.instansi =
          peoDiv.instansi === 'PLTP'
            ? 'SPTP'
            : peoDiv.instansi === 'PLND'
            ? 'PELINDO'
            : peoDiv.instansi;
        await this.repositoryDepartmentMv.insert(body);
      }
    }

    return true;
  }

  private async getDivisions({ page, limit }): Promise<DivisiPeoEntity[]> {
    try {
      const offset = limit * (page - 1);
      return await this.repositoryDivisiPeo.find({
        skip: offset,
        take: limit,
        order: { id: 'ASC' },
      });
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
      });
    } catch (err) {
      console.log(err);
    }
  }
}

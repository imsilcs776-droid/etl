/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { RolePeoEntity } from 'src/peo-role/entity/role.peo.entity';
import { EmployeeDTO } from 'src/peo-role/dto/create-role.peo.dto';
import { PegawaiPeoService } from './pegawai-peo.service';

@Injectable()
export class PegawaiService {
  constructor(
    @InjectRepository(RolePeoEntity)
    private repository: Repository<RolePeoEntity>,
    private syncLogService: SyncLogsService,
    private pegawaiPeoService: PegawaiPeoService,
  ) {}

  public async processPegawai() {
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const departments = await this.getPegawai({
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

    const processedPegawai = await this.repository.count({});
    const syncData = await this.syncLogService.addLog({
      code: await this.repository.metadata.tableName.toString(),
      updated_at: new Date(),
    });
    return { syncData, total: processedPegawai };
  }

  private async create(createPegawaiDto: EmployeeDTO) {
    try {
      return await this.repository.upsert(createPegawaiDto, ['i_objid']);
    } catch (e) {
      const { detail, code } = e || {};
      return await this.syncLogService.addFailedLog({
        entity: await this.repository.metadata.tableName.toString(),
        reason: detail || code,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  private async bulkInsert(departments = []) {
    let count = 0;

    while (count < departments.length) {
      const {
        OBJID,
        PARID,
        CREATED_DATE,
        LAST_UPDATED_DATE,
        COMPANY_CODE,
        STEXT,
        LEVELORGANISASI,
        DESCBOBOTORGANISASI,
        KODEUNITKERJA,
        PERSA,
        WERKS_NEW,
        ENDDA,
      } = departments[count];

      const body = new EmployeeDTO();
      // body.code = KODEUNITKERJA || '-';
      // body.name = STEXT;
      // body.is_active = true;
      // body.updated_at = new Date();
      // body.deleted_at = null;
      // body.i_updated_at = new Date(LAST_UPDATED_DATE);
      // body.created_at = new Date(CREATED_DATE);
      // body.source = 'IMS_INTEGRATION';
      // body.i_com_code = WERKS_NEW;
      // body.i_objid = OBJID;
      // body.i_parid = PARID;
      // body.i_bobot_organisasi = DESCBOBOTORGANISASI;
      // body.i_level_organisasi = LEVELORGANISASI;
      // body.description = STEXT;
      // body.i_endda = ENDDA;

      await this.create(body);
      count++;
    }

    return true;
  }

  /**
   * get department
   * @param {
   *  page, limit, objid
   * }
   * @returns [OBJID,PARID,CREATED_DATE,LAST_UPDATED_DATE,COMPANY_CODE,STEXT,PERSA,WERKS_NEW]
   */
  private async getPegawai({ page, limit }): Promise<any> {
    return await this.pegawaiPeoService.getPegawai({ page, limit });
  }

  // public async setPegawai({ objid }): Promise<any> {
  //   const departments: any[] = await this.pegawaiPeoService.getPegawai({
  //     objid,
  //   });
  //   await this.bulkInsert(departments);
  //   const [department] = departments;
  //   const local = await this.repository.findOneBy({
  //     i_objid: department.OBJID,
  //   });
  //   return {
  //     local,
  //     department,
  //   };
  // }
}

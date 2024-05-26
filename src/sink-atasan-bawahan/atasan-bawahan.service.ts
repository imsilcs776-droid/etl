/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { AtasanBawahanPeoService } from './atasan-bawahan-peo.service';
import { AtasanBawahanPeoEntity } from 'src/peo-user/entities/atasan-bawahan.peo.entity';
import { CreateAtasanBawahanPeoDto } from 'src/peo-user/dto/create-atasan-bawahan.peo.dto';

@Injectable()
export class AtasanBawahanService {
  constructor(
    @InjectRepository(AtasanBawahanPeoEntity)
    private repository: Repository<AtasanBawahanPeoEntity>,
    private syncLogService: SyncLogsService,
    private atasanBawahanPeoService: AtasanBawahanPeoService,
  ) {}

  public async processAtasanBawahan() {
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const departments = await this.getAtasanBawahan({
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

    const processedAtasanBawahan = await this.repository.count({});
    const syncData = await this.syncLogService.addLog({
      code: await this.repository.metadata.tableName.toString(),
      updated_at: new Date(),
    });
    return { syncData, total: processedAtasanBawahan };
  }

  private async create(createAtasanBawahanDto: CreateAtasanBawahanPeoDto) {
    try {
      return await this.repository.upsert(createAtasanBawahanDto, ['i_objid']);
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

      const body = new CreateAtasanBawahanPeoDto();
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
  private async getAtasanBawahan({ page, limit }): Promise<any> {
    return await this.atasanBawahanPeoService.getAtasanBawahan({ page, limit });
  }

  // public async setAtasanBawahan({ objid }): Promise<any> {
  //   const departments: any[] = await this.atasanBawahanPeoService.getAtasanBawahan({
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

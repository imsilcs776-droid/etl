/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { PlhPeoService } from './plh-peo.service';
import * as moment from 'moment';
import { PlhPeoEntity } from './entities/plh.peo.entity';
import { CreatePlhPeoDto } from './dto/create-plh.peo.dto';

@Injectable()
export class PlhService {
  constructor(
    @InjectRepository(PlhPeoEntity)
    private repository: Repository<PlhPeoEntity>,
    private syncLogService: SyncLogsService,
    private divisiPeoService: PlhPeoService,
  ) {}

  public async processPlh() {
    const now = moment().utcOffset('+0700').toDate();
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const divisions = await this.getPlh({
        page,
        limit,
      });
      if (divisions && divisions.length) {
        await this.bulkInsert(divisions);
      } else {
        stop = true;
      }
      page++;
    }

    const processedPlh = await this.repository.count({});
    const syncData = await this.syncLogService.addLog({
      code: await this.repository.metadata.tableName.toString(),
      updated_at: now,
    });
    return { syncData, total: processedPlh };
  }

  private async create(createPlhDto: CreatePlhPeoDto) {
    try {
      return await this.repository.upsert(createPlhDto, ['div_wil']);
    } catch (e) {
      const now = moment().toDate();
      const { detail, code } = e || {};
      return await this.syncLogService.addFailedLog({
        entity: await this.repository.metadata.tableName.toString(),
        reason: detail || code,
        created_at: now,
        updated_at: now,
      });
    }
  }

  async bulkInsert(pejabatArray = []): Promise<boolean> {
    const now = moment().toDate();
    let count = 0;

    while (count < pejabatArray.length) {
      const {
        ID,
        NIPP_PEJABAT,
        NAMA_PEJABAT,
        JABATAN_PEJABAT,
        NIPP_PLH,
        NAMA_PLH,
        JABATAN_PLH,
        LAMPIRAN,
        STATUS,
        CREATED_BY,
        CREATED_AT,
        UPDATED_BY,
        UPDATED_AT,
        CREATED_NAME,
        UPDATED_NAME,
        MULAI,
        AKHIR,
        TIPE,
        KD_PEL_PEJABAT,
        KD_PEL_PLH,
        KD_DIV,
        KD_WIL,
        KD_DIV_PLH,
        KD_WIL_PLH,
        NAJAB_BA,
        PERSG,
        JENIS,
        IP,
        KODE_NOMOR,
        KODE_DIREKTORAT,
        NAMA_DIREKTORAT,
        KELOMPOK,
        NIPP_PLH_BARU,
        NIPP_PEJABAT_BARU,
        NAMA_SUB_AREA,
        CABANG_NAME,
        NAJAB_SUBAREA,
        INSTANSI,
        KD_JABATAN,
        JENIS_SK,
        DOC_NO,
      } = pejabatArray[count];

      const dto = new CreatePlhPeoDto();
      dto.ID = ID;
      dto.NIPP_PEJABAT = NIPP_PEJABAT;
      dto.NAMA_PEJABAT = NAMA_PEJABAT;
      dto.JABATAN_PEJABAT = JABATAN_PEJABAT;
      dto.NIPP_PLH = NIPP_PLH;
      dto.NAMA_PLH = NAMA_PLH;
      dto.JABATAN_PLH = JABATAN_PLH;
      dto.LAMPIRAN = LAMPIRAN;
      dto.STATUS = STATUS;
      dto.CREATED_BY = CREATED_BY;
      dto.CREATED_AT = CREATED_AT;
      dto.UPDATED_BY = UPDATED_BY;
      dto.UPDATED_AT = UPDATED_AT;
      dto.CREATED_NAME = CREATED_NAME;
      dto.UPDATED_NAME = UPDATED_NAME;
      dto.MULAI = MULAI;
      dto.AKHIR = AKHIR;
      dto.TIPE = TIPE;
      dto.KD_PEL_PEJABAT = KD_PEL_PEJABAT;
      dto.KD_PEL_PLH = KD_PEL_PLH;
      dto.KD_DIV = KD_DIV;
      dto.KD_WIL = KD_WIL;
      dto.KD_DIV_PLH = KD_DIV_PLH;
      dto.KD_WIL_PLH = KD_WIL_PLH;
      dto.NAJAB_BA = NAJAB_BA;
      dto.PERSG = PERSG;
      dto.JENIS = JENIS;
      dto.IP = IP;
      dto.KODE_NOMOR = KODE_NOMOR;
      dto.KODE_DIREKTORAT = KODE_DIREKTORAT;
      dto.NAMA_DIREKTORAT = NAMA_DIREKTORAT;
      dto.KELOMPOK = KELOMPOK;
      dto.NIPP_PLH_BARU = NIPP_PLH_BARU;
      dto.NIPP_PEJABAT_BARU = NIPP_PEJABAT_BARU;
      dto.NAMA_SUB_AREA = NAMA_SUB_AREA;
      dto.CABANG_NAME = CABANG_NAME;
      dto.NAJAB_SUBAREA = NAJAB_SUBAREA;
      dto.INSTANSI = INSTANSI;
      dto.KD_JABATAN = KD_JABATAN;
      dto.JENIS_SK = JENIS_SK;
      dto.DOC_NO = DOC_NO;

      await this.create(dto);
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
  private async getPlh({ page, limit }): Promise<any> {
    return await this.divisiPeoService.getPlh({ page, limit });
  }

  // public async setPlh({ objid }): Promise<any> {
  //   const divisions: any[] = await this.divisiPeoService.getPlh({
  //     objid,
  //   });
  //   await this.bulkInsert(divisions);
  //   const [department] = divisions;
  //   const local = await this.repository.findOneBy({
  //     i_objid: department.OBJID,
  //   });
  //   return {
  //     local,
  //     department,
  //   };
  // }
}

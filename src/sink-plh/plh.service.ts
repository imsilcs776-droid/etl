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
  ) { }

  public async processPlh({ nipp_new = '' }) {
    const now = moment().utcOffset('+0700').toDate();
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const divisions = await this.getPlh({
        page,
        limit,
        nipp_new
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
      return await this.repository.upsert(createPlhDto, ['i_id']);
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
      dto.id = ID;
      dto.i_id = ID;
      dto.nipp_pejabat = NIPP_PEJABAT;
      dto.nama_pejabat = NAMA_PEJABAT;
      dto.jabatan_pejabat = JABATAN_PEJABAT;
      dto.nipp_plh = NIPP_PLH;
      dto.nama_plh = NAMA_PLH;
      dto.jabatan_plh = JABATAN_PLH;
      dto.lampiran = LAMPIRAN;
      dto.status = STATUS;
      dto.created_by = CREATED_BY;
      dto.created_at = CREATED_AT;
      dto.updated_by = UPDATED_BY;
      dto.updated_at = UPDATED_AT;
      dto.created_name = CREATED_NAME;
      dto.updated_name = UPDATED_NAME;
      dto.mulai = MULAI;
      dto.akhir = AKHIR;
      dto.tipe = TIPE;
      dto.kd_pel_pejabat = KD_PEL_PEJABAT;
      dto.kd_pel_plh = KD_PEL_PLH;
      dto.kd_div = KD_DIV;
      dto.kd_wil = KD_WIL;
      dto.kd_div_plh = KD_DIV_PLH;
      dto.kd_wil_plh = KD_WIL_PLH;
      dto.najab_ba = NAJAB_BA;
      dto.persg = PERSG;
      dto.jenis = JENIS;
      dto.ip = IP;
      dto.kode_nomor = KODE_NOMOR;
      dto.kode_direktorat = KODE_DIREKTORAT;
      dto.nama_direktorat = NAMA_DIREKTORAT;
      dto.kelompok = KELOMPOK;
      dto.nipp_plh_baru = NIPP_PLH_BARU;
      dto.nipp_pejabat_baru = NIPP_PEJABAT_BARU;
      dto.nama_sub_area = NAMA_SUB_AREA;
      dto.cabang_name = CABANG_NAME;
      dto.najab_subarea = NAJAB_SUBAREA;
      dto.instansi = INSTANSI;
      dto.kd_jabatan = KD_JABATAN;
      dto.jenis_sk = JENIS_SK;
      dto.doc_no = DOC_NO;

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
  private async getPlh({ page, limit, nipp_new }): Promise<any> {
    return await this.divisiPeoService.getPlh({ page, limit, nipp_new });
  }
}

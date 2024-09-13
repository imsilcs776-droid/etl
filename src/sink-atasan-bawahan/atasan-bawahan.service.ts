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
import * as moment from 'moment';

@Injectable()
export class AtasanBawahanService {
  constructor(
    @InjectRepository(AtasanBawahanPeoEntity)
    private repository: Repository<AtasanBawahanPeoEntity>,
    private syncLogService: SyncLogsService,
    private atasanBawahanPeoService: AtasanBawahanPeoService,
  ) {}

  public async processAtasanBawahan({nipp_new = ''}) {
    const now = moment().toDate();
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const atasanBawahans = await this.getAtasanBawahan({
        page,
        limit,
        nipp_new
      });
      if (atasanBawahans && atasanBawahans.length) {
        await this.bulkInsert(atasanBawahans);
      } else {
        stop = true;
      }
      page++;
    }

    const processedAtasanBawahan = await this.repository.count({});
    const syncData = await this.syncLogService.addLog({
      code: await this.repository.metadata.tableName.toString(),
      updated_at: now,
    });
    return { syncData, total: processedAtasanBawahan };
  }

  private async create(createAtasanBawahanDto: CreateAtasanBawahanPeoDto) {
    try {
      return await this.repository.upsert(createAtasanBawahanDto, [
        'nipp_baru_bwh_ats',
      ]);
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

  private async bulkInsert(atasanBawahans = []) {
    const now = moment().toDate();
    let count = 0;

    while (count < atasanBawahans.length) {
      const {
        NIPP,
        NIPP_ATS,
        NAMA,
        NAMA_JABATAN,
        KD_CABANG_SAP,
        SUB_AREA,
        KD_PEL,
        NAMA_ATS,
        NAMA_JABATAN_ATS,
        KD_CABANG_SAP_ATS,
        SUB_AREA_ATS,
        KD_PEL_ATS,
        LVL,
        COMPANY_CODE,
        COMPANY_CODE_ATS,
        EMAIL,
        EMAIL_ATS,
        PEMBUAT_LVL,
        KD_WIL,
        KD_DIV,
        KD_WIL_ATS,
        KD_DIV_ATS,
        SHORT,
        SUBDI,
        SHORT_ATS,
        SUBDI_ATS,
        NIPP_BARU,
        NIPP_ATS_BARU,
        INSTANSI,
        INSTANSI_ATS,
        PEGAWAI,
      } = atasanBawahans[count];

      const dto = new CreateAtasanBawahanPeoDto();
      dto.nipp = NIPP;
      dto.nipp_ats = NIPP_ATS;
      dto.nama = NAMA;
      dto.nama_jabatan = NAMA_JABATAN;
      dto.kd_cabang_sap = KD_CABANG_SAP;
      dto.sub_area = SUB_AREA;
      dto.kd_pel = KD_PEL;
      dto.nama_ats = NAMA_ATS;
      dto.nama_jabatan_ats = NAMA_JABATAN_ATS;
      dto.kd_cabang_sap_ats = KD_CABANG_SAP_ATS;
      dto.sub_area_ats = SUB_AREA_ATS;
      dto.kd_pel_ats = KD_PEL_ATS;
      dto.lvl = LVL;
      dto.company_code = COMPANY_CODE;
      dto.company_code_ats = COMPANY_CODE_ATS;
      dto.email = EMAIL;
      dto.email_ats = EMAIL_ATS;
      dto.pembuat_lvl = PEMBUAT_LVL;
      dto.kode_wil = KD_WIL;
      dto.kd_div = KD_DIV;
      dto.kd_wil_ats = KD_WIL_ATS;
      dto.kd_div_ats = KD_DIV_ATS;
      dto.short = SHORT;
      dto.subdi = SUBDI;
      dto.short_ats = SHORT_ATS;
      dto.subdi_ats = SUBDI_ATS;
      dto.nipp_baru = NIPP_BARU;
      dto.nipp_ats_baru = NIPP_ATS_BARU;
      dto.instansi = INSTANSI;
      dto.instansi_ats = INSTANSI_ATS;
      dto.pegawai = PEGAWAI;
      dto.nipp_baru_bwh_ats = `${NIPP_BARU};${NIPP_ATS_BARU}`;
      dto.updated_at = now;

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
  private async getAtasanBawahan({ page, limit, nipp_new }): Promise<any> {
    return await this.atasanBawahanPeoService.getAtasanBawahan({ page, limit, nipp_new });
  }
}

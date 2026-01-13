/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { DivisiPeoService } from './divisi-peo.service';
import { DivisiPeoEntity } from 'src/peo-department/entities/divisi.peo.entity';
import { CreateDivisiPeoDto } from 'src/peo-department/dto/create-divisi.peo.dto';
import * as moment from 'moment';

@Injectable()
export class DivisiService {
  constructor(
    @InjectRepository(DivisiPeoEntity)
    private repository: Repository<DivisiPeoEntity>,
    private syncLogService: SyncLogsService,
    private divisiPeoService: DivisiPeoService,
  ) {}

  public async processDivisi({ nipp_new = '' }) {
    const now = moment().utcOffset('+0700').toDate();
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const divisions = await this.getDivisi({
        page,
        limit,
        nipp_new,
      });
      if (divisions && divisions.length) {
        await this.bulkInsert(divisions);
      } else {
        stop = true;
      }
      page++;
    }

    const processedDivisi = await this.repository.count({});
    const syncData = await this.syncLogService.addLog({
      code: await this.repository.metadata.tableName.toString(),
      updated_at: now,
    });
    return { syncData, total: processedDivisi };
  }

  private async create(createDivisiDto: CreateDivisiPeoDto) {
    try {
      return await this.repository.upsert(createDivisiDto, ['div_wil']);
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

  private async bulkInsert(divisions = []) {
    const now = moment().toDate();
    let count = 0;

    while (count < divisions.length) {
      const {
        KD_DIV_ARSIP,
        KD_INDUK,
        NAMA_DIR,
        KD_WIL_ARSIP,
        NAMA_CABANG,
        UPDATED,
        KD_SUB,
        NIP_PEJABAT,
        NAMA_PEJABAT,
        EMAIL_PEJABAT,
        PARENT,
        LABEL_PARENT,
        KD_SEK,
        KODE_NOMOR,
        KODE_DIREKTORAT,
        NAMA_DIREKTORAT,
        KELOMPOK,
        AKSES_SURAT,
        TTD,
        GRUP,
        PENGOLAH,
        KD_SUBSI,
        INSTANSI,
        KD_JABATAN,
        PEJABAT,
        JENIS,
        NAMA_SUB_TRAVEL,
        CREATED_BY,
        IS_DELETED,
        CREATED,
        CREATED_NAME,
        UPDATED_BY,
        UPDATED_NAME,
        WERKS_NEW,
      } = divisions[count];

      const dto = new CreateDivisiPeoDto();
      dto.kd_div_arsip = KD_DIV_ARSIP;
      dto.kd_induk = KD_INDUK;
      dto.nama_dir = NAMA_DIR;
      dto.kd_wil_arsip = KD_WIL_ARSIP;
      dto.nama_cabang = NAMA_CABANG;
      dto.updated = UPDATED;
      dto.kd_sub = KD_SUB;
      dto.nip_pejabat = NIP_PEJABAT;
      dto.nama_pejabat = NAMA_PEJABAT;
      dto.email_pejabat = EMAIL_PEJABAT;
      dto.parent = PARENT;
      dto.label_parent = LABEL_PARENT;
      dto.kd_sek = KD_SEK;
      dto.kode_nomor = KODE_NOMOR;
      dto.kode_direktorat = KODE_DIREKTORAT;
      dto.nama_direktorat = NAMA_DIREKTORAT;
      dto.kelompok = KELOMPOK;
      dto.akses_surat = AKSES_SURAT;
      dto.ttd = TTD;
      dto.grup = GRUP;
      dto.pengolah = PENGOLAH;
      dto.kd_subsi = KD_SUBSI;
      dto.instansi = INSTANSI;
      dto.kd_jabatan = KD_JABATAN;
      dto.pejabat = PEJABAT;
      dto.jenis = JENIS;
      dto.nama_sub_travel = NAMA_SUB_TRAVEL;
      dto.created_by = CREATED_BY;
      dto.is_deleted = IS_DELETED;
      dto.created = CREATED;
      dto.created_name = CREATED_NAME;
      dto.updated_by = UPDATED_BY;
      dto.updated_name = UPDATED_NAME;
      dto.div_wil = `${KD_DIV_ARSIP};${KD_WIL_ARSIP}`;
      dto.werks_new = WERKS_NEW;
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
  private async getDivisi({ page, limit, nipp_new }): Promise<any> {
    return await this.divisiPeoService.getDivisiWithPlh({
      page,
      limit,
      nipp_new,
    });
  }
}

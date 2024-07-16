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
        id,
        nipp_pejabat,
        nama_pejabat,
        jabatan_pejabat,
        nipp_plh,
        nama_plh,
        jabatan_plh,
        lampiran,
        status,
        created_by,
        created_at,
        updated_by,
        updated_at,
        created_name,
        updated_name,
        mulai,
        akhir,
        tipe,
        kd_pel_pejabat,
        kd_pel_plh,
        kd_div,
        kd_wil,
        kd_div_plh,
        kd_wil_plh,
        najab_ba,
        persg,
        jenis,
        ip,
        kode_nomor,
        kode_direktorat,
        nama_direktorat,
        kelompok,
        nipp_plh_baru,
        nipp_pejabat_baru,
        nama_sub_area,
        cabang_name,
        najab_subarea,
        instansi,
        kd_jabatan,
        jenis_sk,
        doc_no,
      } = pejabatArray[count];

      const dto = new CreatePlhPeoDto();
      dto.id = id;
      dto.nipp_pejabat = nipp_pejabat;
      dto.nama_pejabat = nama_pejabat;
      dto.jabatan_pejabat = jabatan_pejabat;
      dto.nipp_plh = nipp_plh;
      dto.nama_plh = nama_plh;
      dto.jabatan_plh = jabatan_plh;
      dto.lampiran = lampiran;
      dto.status = status;
      dto.created_by = created_by;
      dto.created_at = created_at;
      dto.updated_by = updated_by;
      dto.updated_at = updated_at;
      dto.created_name = created_name;
      dto.updated_name = updated_name;
      dto.mulai = mulai;
      dto.akhir = akhir;
      dto.tipe = tipe;
      dto.kd_pel_pejabat = kd_pel_pejabat;
      dto.kd_pel_plh = kd_pel_plh;
      dto.kd_div = kd_div;
      dto.kd_wil = kd_wil;
      dto.kd_div_plh = kd_div_plh;
      dto.kd_wil_plh = kd_wil_plh;
      dto.najab_ba = najab_ba;
      dto.persg = persg;
      dto.jenis = jenis;
      dto.ip = ip;
      dto.kode_nomor = kode_nomor;
      dto.kode_direktorat = kode_direktorat;
      dto.nama_direktorat = nama_direktorat;
      dto.kelompok = kelompok;
      dto.nipp_plh_baru = nipp_plh_baru;
      dto.nipp_pejabat_baru = nipp_pejabat_baru;
      dto.nama_sub_area = nama_sub_area;
      dto.cabang_name = cabang_name;
      dto.najab_subarea = najab_subarea;
      dto.instansi = instansi;
      dto.kd_jabatan = kd_jabatan;
      dto.jenis_sk = jenis_sk;
      dto.doc_no = doc_no;

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

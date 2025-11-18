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
import * as moment from 'moment';

@Injectable()
export class PegawaiService {
  constructor(
    @InjectRepository(RolePeoEntity)
    private repository: Repository<RolePeoEntity>,
    private syncLogService: SyncLogsService,
    private pegawaiPeoService: PegawaiPeoService,
  ) { }

  public async processPegawai({ nipp_new = '' }) {
    const now = moment().toDate();
    const limit = 100;
    let stop = false;
    let page = 1;

    /**
     * single user
     */
    if (nipp_new) {
      const pegawais = await this.getPegawai({
        page,
        limit,
        nipp_new
      });
      if (pegawais && pegawais.length) {
        await this.bulkInsert(pegawais);
        const processedPegawai = await this.repository.count({});
        const syncData = await this.syncLogService.addLog({
          code: await this.repository.metadata.tableName.toString(),
          updated_at: now,
        });
        return { syncData, total: processedPegawai, isExist: true };
      }

      const processedPegawai = await this.repository.count({});
      return { total: processedPegawai, isExist: !!pegawais?.length };
    }

    /**
     * get all user
     */
    while (!stop) {
      await delay(500);
      const pegawais = await this.getPegawai({
        page,
        limit,
        nipp_new
      });
      if (pegawais && pegawais.length) {
        await this.bulkInsert(pegawais);
      } else {
        stop = true;
      }
      page++;
    }

    const processedPegawai = await this.repository.count({});
    const syncData = await this.syncLogService.addLog({
      code: await this.repository.metadata.tableName.toString(),
      updated_at: now,
    });
    return { syncData, total: processedPegawai, isExist: true };
  }

  private async create(createPegawaiDto: EmployeeDTO) {
    try {
      return await this.repository.upsert(createPegawaiDto, ['nipp']);
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

  private async bulkInsert(pegawais = []) {
    const now = moment().toDate();
    let count = 0;

    while (count < pegawais.length) {
      const {
        KODE_SAP,
        NAMA, // name user
        NIPP, // untuk user key, user login
        KD_CABANG_SAP,
        NAMA_CABANG,
        KD_JABATAN,
        NAMA_JABATAN,
        KELAS_JABATAN,
        KD_DIR,
        NAMA_DIR,
        KD_SUB,
        NAMA_SUB,
        EMAIL,
        HP,
        ACCOUNT_AD,
        KD_WIL_ARSIP,
        KD_DIV_ARSIP,
        COOKIE,
        PERSG,
        KD_PEL,
        SUB_AREA,
        NAMA_SUB_AREA,
        JENIS,
        NOTIF,
        JENIS_SK,
        NAMA_JABATAN_SK,
        TRFS0,
        TMT_PERIODIK,
        TUNJANGAN,
        TALHIR,
        PATHIR,
        STEXT,
        TTL,
        KODE_NOMOR,
        KODE_DIREKTORAT,
        AKSES_SURAT,
        NAMA_DIREKTORAT,
        KELOMPOK,
        NIPP_BARU,
        TTD,
        CABANG_NAME,
        GRUP,
        PENGOLAH,
        BISA_HAPUS,
        COMPANY_CODE,
        INSTANSI,
        LAST_UPDATED_DATE,
        COST_CENTER,
        BANK_KEY,
        BANK_NAME,
        BANK_ACCOUNT,
        WERKS_NEW,
        PBTXT_NEW,
        BTRTL_NEW,
        BTRTX_NEW,
        CREATED_DATE,
        TRAVELCOSTCENTER,
        NAMA_SUB_TRAVEL,
        COSTCENTER_STO,
        CHIEFPOSITION,
        PERSASTO,
        SUBPERSA_STO,
        PERSATEXT_STO,
        SUBPERSATEXT_STO,
        PAYSCALETYPE,
        PAYSCALETYPETEXT,
      } = pegawais[count];

      const dto = new EmployeeDTO();
      dto.kode_sap = KODE_SAP;
      dto.nama = NAMA;
      dto.nipp = NIPP;
      dto.kd_cabang_sap = KD_CABANG_SAP;
      dto.nama_cabang = NAMA_CABANG;
      dto.kd_jabatan = KD_JABATAN;
      dto.nama_jabatan = NAMA_JABATAN;
      dto.kelas_jabatan = KELAS_JABATAN;
      dto.kd_dir = KD_DIR;
      dto.nama_dir = NAMA_DIR;
      dto.kd_sub = KD_SUB;
      dto.nama_sub = NAMA_SUB;
      dto.email = EMAIL;
      dto.hp = HP;
      dto.account_ad = ACCOUNT_AD;
      dto.kd_wil_arsip = KD_WIL_ARSIP;
      dto.kd_div_arsip = KD_DIV_ARSIP;
      dto.cookie = COOKIE;
      dto.persg = PERSG;
      dto.kd_pel = KD_PEL;
      dto.sub_area = SUB_AREA;
      dto.nama_sub_area = NAMA_SUB_AREA;
      dto.jenis = JENIS;
      dto.notif = NOTIF;
      dto.jenis_sk = JENIS_SK;
      dto.nama_jabatan_sk = NAMA_JABATAN_SK;
      dto.trfso = TRFS0;
      dto.tmt_periodik = TMT_PERIODIK;
      dto.tunjangan = TUNJANGAN;
      dto.talhir = TALHIR;
      dto.pathir = PATHIR;
      dto.stext = STEXT;
      dto.ttl = TTL;
      dto.kode_nomor = KODE_NOMOR;
      dto.kode_direktorat = KODE_DIREKTORAT;
      dto.akses_surat = AKSES_SURAT;
      dto.nama_direktorat = NAMA_DIREKTORAT;
      dto.kelompok = KELOMPOK;
      dto.nipp_baru = NIPP_BARU;
      dto.ttd = TTD;
      dto.cabang_name = CABANG_NAME;
      dto.grup = GRUP;
      dto.pengolah = PENGOLAH;
      dto.bisa_hapus = BISA_HAPUS;
      dto.company_code = COMPANY_CODE;
      dto.instansi = INSTANSI;
      dto.last_updated_date = LAST_UPDATED_DATE;
      dto.cost_center = COST_CENTER;
      dto.bank_key = BANK_KEY;
      dto.bank_name = BANK_NAME;
      dto.bank_account = BANK_ACCOUNT;
      dto.werks_new = WERKS_NEW;
      dto.pbtxt_new = PBTXT_NEW;
      dto.btrl_new = BTRTL_NEW;
      dto.btrx_new = BTRTX_NEW;
      dto.created_date = CREATED_DATE;
      dto.travelcostcenter = TRAVELCOSTCENTER;
      dto.nama_sub_travel = NAMA_SUB_TRAVEL;
      dto.costcenter_sto = COSTCENTER_STO;
      dto.chiefposition = CHIEFPOSITION;
      dto.persasto = PERSASTO;
      dto.subpersa_sto = SUBPERSA_STO;
      dto.persatext_sto = PERSATEXT_STO;
      dto.subpersatext_sto = SUBPERSATEXT_STO;
      dto.payscaletype = PAYSCALETYPE;
      dto.payscaletypetext = PAYSCALETYPETEXT;
      dto.pegawai = GRUP;
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
  private async getPegawai({ page, limit, nipp_new }): Promise<any> {
    return await this.pegawaiPeoService.getPegawai({ page, limit, nipp_new });
  }
}

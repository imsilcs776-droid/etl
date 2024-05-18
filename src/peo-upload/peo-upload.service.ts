import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { UploadDivisiDto } from './dto/upload-divisi.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DivisiMvEntity } from './entities/divisi.mv.entity';
import { UploadPegawaiDto } from './dto/upload-pegawai.dto';
import { RolePegawaiMvEntity } from './entities/role-pegawai.mv.entity';

@Injectable()
export class PeoUploadService {
  constructor(
    @InjectRepository(DivisiMvEntity)
    private repoDivisi: Repository<DivisiMvEntity>,
    @InjectRepository(RolePegawaiMvEntity)
    private repoRole: Repository<RolePegawaiMvEntity>,
  ) {}
  private async excellToJSon(@UploadedFile() file) {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      return XLSX.utils.sheet_to_json(sheet);
    } catch (e) {
      throw e.message;
    }
  }

  public async processDivisi(@UploadedFile() file) {
    try {
      const messages = [];
      let message;
      const data = await this.excellToJSon(file);

      for (const divisi of data as UploadDivisiDto[]) {
        if (typeof divisi.KD_DIV_ARSIP == 'undefined') {
          throw new BadRequestException('wrong excel file');
        }

        console.log(divisi);
        const insertObject = {
          kd_div_arsip: divisi.KD_DIV_ARSIP,
          kd_induk: divisi.KD_INDUK,
          nama_dir: divisi.NAMA_DIR,
          kd_wil_arsip: divisi.KD_WIL_ARSIP,
          nama_cabang: divisi.NAMA_CABANG,
          updated: divisi.UPDATED,
          kd_sub: divisi.KD_SUB,
          nip_pejabat: divisi.NIP_PEJABAT,
          nama_pejabat: divisi.NAMA_PEJABAT,
          email_pejabat: divisi.EMAIL_PEJABAT,
          parent: divisi.PARENT,
          label_parent: divisi.LABEL_PARENT,
          id_old: divisi.ID,
          kd_sek: divisi.KD_SEK,
          kode_nomor: divisi.KODE_NOMOR,
          kode_direktorat: divisi.KODE_DIREKTORAT,
          nama_direktorat: divisi.NAMA_DIREKTORAT,
          kelompok: divisi.KELOMPOK,
          akses_surat: divisi.AKSES_SURAT,
          ttd: divisi.TTD,
          group: divisi.GRUP,
          pengolah: divisi.PENGOLAH,
          kd_subsi: divisi.KD_SUBSI,
          instansi: divisi.INSTANSI,
          kd_jabatan: divisi.KD_JABATAN,
          pejabat: divisi.PEJABAT,
          jenis: divisi.JENIS,
          nama_sub_travel: divisi.NAMA_SUB_TRAVEL,
          created_by: divisi.CREATED_BY,
          is_deleted: divisi.IS_DELETED,
          created: divisi.CREATED,
          created_name: divisi.CREATED_NAME,
          updated_by: divisi.UPDATED_BY,
          updated_name: divisi.UPDATED_NAME,
        };
        const insertDivisi = await this.repoDivisi.insert(insertObject);
        if (insertDivisi) {
          message = 'Insert KD_DIV_ARSIP ' + divisi.KD_DIV_ARSIP + ' success';
        } else {
          message = 'Insert KD_DIV_ARSIP ' + divisi.KD_DIV_ARSIP + ' failed';
        }
        messages.push(message);
      }
      return {
        status: 'upload divisi done',
        messages,
      };
    } catch (e) {
      throw e.message;
    }
  }

  public async processPegawai(@UploadedFile() file) {
    try {
      const messages = [];
      let message;
      const data = await this.excellToJSon(file);
      for (const role of data as UploadPegawaiDto[]) {
        if (typeof role.NIPP == 'undefined') {
          throw new BadRequestException('wrong excel file');
        }
        const insertObject = {
          account_ad: role.ACCOUNT_AD,
          akses_surat: role.AKSES_SURAT,
          bank_account: role.BANK_ACCOUNT,
          bank_key: role.BANK_KEY,
          bank_name: role.BANK_NAME,
          bisa_hapus: role.BISA_HAPUS,
          btrl_new: role.BTRTL_NEW,
          btrx_new: role.BTRTX_NEW,
          cabang_name: role.CABANG_NAME,
          chiefposition: role.CHIEFPOSITION,
          company_code: role.COMPANY_CODE,
          cookie: role.COOKIE,
          cost_center: role.COST_CENTER,
          costcenter_sto: role.COSTCENTER_STO,
          created_date: role.CREATED_DATE,
          email: role.EMAIL,
          group: role.GRUP,
          hp: role.HP,
          id_old: role.ID,
          instansi: role.INSTANSI,
          jenis: role.JENIS,
          jenis_sk: role.JENIS_SK,
          kd_cabang_sap: role.KD_CABANG_SAP,
          kd_dir: role.KD_DIR,
          kd_div_arsip: role.KD_DIV_ARSIP,
          kd_jabatan: role.KD_JABATAN,
          kd_pel: role.KD_PEL,
          kd_sub: role.KD_SUB,
          kd_wil_arsip: role.KD_WIL_ARSIP,
          kelas_jabatan: role.KELAS_JABATAN,
          kelompok: role.KELOMPOK,
          kode_direktorat: role.KODE_DIREKTORAT,
          kode_nomor: role.KODE_NOMOR,
          kode_sap: role.KODE_SAP,
          last_updated_date: role.LAST_UPDATED_DATE,
          nama: role.NAMA,
          nama_cabang: role.NAMA_CABANG,
          nama_dir: role.NAMA_DIR,
          nama_direktorat: role.NAMA_DIREKTORAT,
          nama_jabatan: role.NAMA_JABATAN,
          nama_jabatan_sk: role.NAMA_JABATAN_SK,
          nama_sub: role.NAMA_SUB,
          nama_sub_travel: role.NAMA_SUB_TRAVEL,
          nama_subarea: role.NAMA_SUB_AREA,
          nipp: role.NIPP,
          nipp_baru: role.NIPP_BARU,
          notif: role.NOTIF,
          pathir: role.PATHIR,
          payscaletype: role.PAYSCALETYPE,
          payscaletypetext: role.PAYSCALETYPETEXT,
          pbtxt_new: role.PBTXT_NEW,
          pegawai: role.PEGAWAI,
          pengolah: role.PENGOLAH,
          persasto: role.PERSA_STO,
          persatext_sto: role.PERSATEXT_STO,
          persg: role.PERSG,
          stext: role.STEXT,
          sub_area: role.SUB_AREA,
          subpersa_sto: role.SUBPERSA_STO,
          subpersatext_sto: role.SUBPERSATEXT_STO,
          talhir: role.TALHIR,
          tmt_periodik: role.TMT_PERIODIK,
          travelcostcenter: role.TRAVELCOSTCENTER,
          trfso: role.TRFS0,
          ttd: role.TTD,
          ttl: role.TTL,
          tunjangan: role.TUNJANGAN,
          werks_new: role.WERKS_NEW,
        }

        const insertRole = await this.repoRole.insert(insertObject);
        if (insertRole) {
          message = 'Insert NIPP ' + role.NIPP + ' success';
        } else {
          message = 'Insert NIPP ' + role.NIPP + ' failed';
        }
        messages.push(message);
      }
      return {
        status: 'upload divisi done',
        messages,
      };
    } catch (e) {
      throw e.message;
    }
  }

  public async processAtasanBawahan(@UploadedFile() file) {
    try {
      const data = await this.excellToJSon(file);
      return data;
    } catch (e) {
      throw e.message;
    }
  }
}

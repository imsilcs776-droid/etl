import { BadRequestException, Injectable, UploadedFile } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { CreateDivisiPeoDto } from '../peo-department/dto/create-divisi.peo.dto';
import { UploadDivisiDto } from './dto/upload-divisi.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DivisiMvEntity } from './entities/divisi.mv.entity';

@Injectable()
export class PeoUploadService {
  constructor(
    @InjectRepository(DivisiMvEntity)
    private repoDivisi: Repository<DivisiMvEntity>,
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
      const data = await this.excellToJSon(file);
      return data;
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

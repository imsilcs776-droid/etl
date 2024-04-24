import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class UserMDMService {
  constructor(
    @InjectConnection('pelindo_mdm') private readonly connection: Connection,
  ) {}

  async getAccount({ page = 1, limit = 50 }) {
    return await this.connection
      .createQueryBuilder()
      .select('*')
      .from((subQuery) => {
        return subQuery
          .select('SAFM_PERUBAHAN_ORGANISASI.CNAME')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PNALT')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PNALT_NEW')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.COMPANY_CODE')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.ANSVH')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.SHORT')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PGTXT')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PKTXT')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PLANS')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PBTXT')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.BTRTX')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.LAST_UPDATED_DATE')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.KD_AKTIF')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.WERKS_NEW')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.ENDA')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.SUBDI')
          .addSelect('SAFM_PEGAWAI.OFFICMAIL')
          .addSelect(
            `ROW_NUMBER () OVER (
              PARTITION BY SAFM_PERUBAHAN_ORGANISASI.PNALT
              ORDER BY
                SAFM_PERUBAHAN_ORGANISASI.LAST_UPDATED_DATE DESC
            ) AS rn`,
          )
          .from('SAFM_PERUBAHAN_ORGANISASI', 'SAFM_PERUBAHAN_ORGANISASI')
          .leftJoin(
            'SAFM_PEGAWAI',
            'SAFM_PEGAWAI',
            'SAFM_PERUBAHAN_ORGANISASI.PNALT = SAFM_PEGAWAI.PNALT',
          )
          .andWhere(`SAFM_PERUBAHAN_ORGANISASI.KD_AKTIF = 'A'`)
          .andWhere(`SAFM_PERUBAHAN_ORGANISASI.COMPANY_CODE = '1000'`)
          .andWhere(
            `SAFM_PERUBAHAN_ORGANISASI.WERKS_NEW IN ('1000' ,'1310', '1320', '1330', '1340')`,
          )
          .andWhere(
            `TO_CHAR (SAFM_PERUBAHAN_ORGANISASI.enda, 'ddmmyyyy') = '31129999'`,
          );
      }, '')
      .andWhere('RN = 1')
      .andWhere(`ANSVH NOT IN ('15', '09', '10', '11', '12', '07', '16', '08')`)
      .andWhere(`SHORT <> '99999999'`)
      .andWhere(`CNAME <> 'DUMMY PCP'`)
      .andWhere(`PGTXT <> 'Pensiun'`)
      .andWhere(`PGTXT <> 'External Employee'`)
      .andWhere(`pktxt <> 'Direksi'`)
      .andWhere(`pktxt <> 'Komisaris'`)
      .andWhere(`PLANS NOT LIKE 'CPDMT%'`)
      .orderBy('PNALT')
      .limit(limit)
      .offset(limit * (page - 1))
      .getRawMany();
  }

  async getAccByNippNew({ nipp_new }) {
    return await this.connection
      .createQueryBuilder()
      .select('*')
      .from((subQuery) => {
        return subQuery
          .select('SAFM_PERUBAHAN_ORGANISASI.CNAME')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PNALT')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PNALT_NEW')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.COMPANY_CODE')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.ANSVH')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.SHORT')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PGTXT')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PKTXT')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PLANS')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.PBTXT')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.BTRTX')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.LAST_UPDATED_DATE')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.KD_AKTIF')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.WERKS_NEW')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.ENDA')
          .addSelect('SAFM_PERUBAHAN_ORGANISASI.SUBDI')
          .addSelect('SAFM_PEGAWAI.OFFICMAIL')
          .addSelect(
            `ROW_NUMBER () OVER (
              PARTITION BY SAFM_PERUBAHAN_ORGANISASI.PNALT
              ORDER BY
                SAFM_PERUBAHAN_ORGANISASI.LAST_UPDATED_DATE DESC
            ) AS rn`,
          )
          .from('SAFM_PERUBAHAN_ORGANISASI', 'SAFM_PERUBAHAN_ORGANISASI')
          .leftJoin(
            'SAFM_PEGAWAI',
            'SAFM_PEGAWAI',
            'SAFM_PERUBAHAN_ORGANISASI.PNALT = SAFM_PEGAWAI.PNALT',
          )
          .andWhere(`SAFM_PERUBAHAN_ORGANISASI.PNALT_NEW = :nipp_new`, {nipp_new})
          .andWhere(`SAFM_PERUBAHAN_ORGANISASI.KD_AKTIF = 'A'`)
          .andWhere(`SAFM_PERUBAHAN_ORGANISASI.COMPANY_CODE = '1000'`)
          .andWhere(
            `SAFM_PERUBAHAN_ORGANISASI.WERKS_NEW IN ('1000' ,'1310', '1320', '1330', '1340')`,
          )
          .andWhere(
            `TO_CHAR (SAFM_PERUBAHAN_ORGANISASI.enda, 'ddmmyyyy') = '31129999'`,
          );
      }, '')
      .andWhere('RN = 1')
      .andWhere(`ANSVH NOT IN ('15', '09', '10', '11', '12', '07', '16', '08')`)
      .andWhere(`SHORT <> '99999999'`)
      .andWhere(`CNAME <> 'DUMMY PCP'`)
      .andWhere(`PGTXT <> 'Pensiun'`)
      .andWhere(`PGTXT <> 'External Employee'`)
      .andWhere(`pktxt <> 'Direksi'`)
      .andWhere(`pktxt <> 'Komisaris'`)
      .andWhere(`PLANS NOT LIKE 'CPDMT%'`)
      .orderBy('PNALT')
      .limit(1)
      .getRawOne();
  }
}

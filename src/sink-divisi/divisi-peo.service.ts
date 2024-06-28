import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class DivisiPeoService {
  constructor(
    @InjectConnection('pelindo_peo') private readonly connection: Connection,
  ) {}

  async getDivisi({ page = 1, limit = 50, objid = '' }) {
    return await this.connection.query(`
    SELECT *
      FROM PSO_DIVISI
      WHERE GRUP IN ('PLND', 'PLTP')
    ORDER BY
      KD_DIV_ARSIP,
      GRUP ASC
    OFFSET ${limit * (page - 1)} ROWS FETCH NEXT ${limit} ROWS ONLY
    `);
  }

  // async getDivisi({ page = 1, limit = 50, objid = '' }) {
  //   const query = this.connection
  //     .createQueryBuilder()
  //     .select('*')
  //     .from((subQuery) => {
  //       return subQuery
  //         .select('SAFM_STRUKTUR_ORGANISASI.OBJID')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.PARID')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.SHORT')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.LAST_UPDATED_DATE')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.KD_AKTIF')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.STEXT')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.ENDDA')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.CREATED_DATE')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.COMPANY_CODE')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.DESCBOBOTORGANISASI')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.LEVELORGANISASI')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.KODEUNITKERJA')
  //         .addSelect('SAFM_STRUKTUR_ORGANISASI.PERSA')
  //         .addSelect('SAFM_PERUBAHAN_ORGANISASI.WERK_NEW')
  //         .addSelect(
  //           `ROW_NUMBER () OVER (
  //             PARTITION BY SAFM_STRUKTUR_ORGANISASI.OBJID
  //             ORDER BY
  //               SAFM_STRUKTUR_ORGANISASI.LAST_UPDATED_DATE DESC
  //           ) AS rn`,
  //         )
  //         .from('SAFM_STRUKTUR_ORGANISASI', 'SAFM_STRUKTUR_ORGANISASI')
  //         .leftJoin(
  //           'SAFM_PERUBAHAN_ORGANISASI',
  //           'SAFM_PERUBAHAN_ORGANISASI',
  //           `SAFM_PERUBAHAN_ORGANISASI.SHORT = SAFM_STRUKTUR_ORGANISASI.OBJID
  //           AND SAFM_PERUBAHAN_ORGANISASI.SAFM_PERUBAHAN_ORGANISASI.COMPANY_CODE = '1000'
  //           AND SAFM_PERUBAHAN_ORGANISASI.WERKS_NEW IN ('1000', '1310', '1320', '1330', '1340')
  //           AND SAFM_PERUBAHAN_ORGANISASI.TO_CHAR (enda, 'ddmmyyyy') = '31129999'
  //           AND SAFM_PERUBAHAN_ORGANISASI.ANSVH NOT IN ('15', '09', '10', '11', '12', '87', '16', '08')
  //           AND SAFM_PERUBAHAN_ORGANISASI.SHORT <> '99999999'
  //           AND SAFM_PERUBAHAN_ORGANISASI.CNAME <> 'DUMMY PCP'
  //           AND SAFM_PERUBAHAN_ORGANISASI.PGTXT <> 'Pensiun'
  //           AND SAFM_PERUBAHAN_ORGANISASI.PGTXT <> 'External Employee'
  //           AND SAFM_PERUBAHAN_ORGANISASI.pktxt <> 'Direksi'
  //           AND SAFM_PERUBAHAN_ORGANISASI.pktxt <> 'Komisaris'
  //           AND SAFM_PERUBAHAN_ORGANISASI.PLANS NOT LIKE 'CPDMT'
  //           `,
  //         )
  //         .andWhere(`SAFM_STRUKTUR_ORGANISASI.COMPANY_CODE = '1000'`)
  //         .andWhere(`SAFM_STRUKTUR_ORGANISASI.OTYPE IN ('O')`)
  //         .andWhere(
  //           `TO_CHAR (SAFM_STRUKTUR_ORGANISASI.ENDDA, 'ddmmyyyy') = '31129999'`,
  //         )
  //         .andWhere(
  //           `TRUNC(SAFM_STRUKTUR_ORGANISASI.LAST_UPDATED_DATE) = TRUNC(sysdate)`,
  //         );
  //     }, '')
  //     .andWhere('RN = 1')
  //     .andWhere(`KD_AKTIF = 'A'`);

  //   if (objid) {
  //     query.andWhere(`OBJID = :objid`, { objid });
  //   }

  //   // console.log(await query.getQuery(), objid);
  //   return await query
  //     .andWhere(
  //       `ENDDA > SYSDATE START WITH objid = '70005106' CONNECT BY PRIOR OBJID = PARID`,
  //     )
  //     .orderBy('LAST_UPDATED_DATE')
  //     .limit(limit)
  //     .offset(limit * (page - 1))
  //     .getQuery();
  // }
}

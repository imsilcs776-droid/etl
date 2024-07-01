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
    SELECT c.*, a.WERKS_NEW
    FROM PSO_DIVISI c
    JOIN (
      SELECT DISTINCT KD_DIV_ARSIP, KD_WIL_ARSIP, WERKS_NEW
      FROM PSO_ROLE_PEGAWAI
      WHERE GRUP IN ('PLTP', 'PLND')
        AND NAMA_JABATAN <> 'Alih Daya'
        AND INSTANSI <> '9999'
        AND COMPANY_CODE <> '9999'
        AND WERKS_NEW IS NOT NULL
        AND lower(NAMA) NOT LIKE '%dummy%'
        AND lower(NAMA) NOT LIKE '%user%'
        AND lower(NAMA) NOT LIKE '%test%'
        AND lower(NAMA) NOT LIKE '%sit -%'
        AND KD_DIV_ARSIP IS NOT NULL
        AND JENIS IS NOT NULL
    ) a ON c.KD_DIV_ARSIP = a.KD_DIV_ARSIP 
      AND c.KD_WIL_ARSIP = a.KD_WIL_ARSIP
    WHERE c.KD_DIV_ARSIP IS NOT NULL
    ORDER BY c.KD_DIV_ARSIP, c.GRUP ASC    
    OFFSET ${limit * (page - 1)} ROWS FETCH NEXT ${limit} ROWS ONLY
    `);
  }

  // async getDivisi({ page = 1, limit = 50, objid = '' }) {
  //   return await this.connection.query(`
  //   SELECT c.*, a.WERKS_NEW
  //   FROM PSO_DIVISI c
  //   JOIN (
  //     SELECT DISTINCT KD_DIV_ARSIP, KD_WIL_ARSIP, WERKS_NEW
  //     FROM PSO_ROLE_PEGAWAI x
  //     WHERE x.GRUP IN ('PLTP', 'PLND')
  //   ) a ON c.KD_DIV_ARSIP = a.KD_DIV_ARSIP AND a.KD_WIL_ARSIP = c.KD_WIL_ARSIP
  //   WHERE
  //     c.KD_DIV_ARSIP IN (
  //       SELECT DISTINCT a.KD_DIV_ARSIP
  //       FROM PSO_ROLE_PEGAWAI a
  //       WHERE a.GRUP IN ('PLTP', 'PLND')
  //         AND a.NAMA_JABATAN <> 'Alih Daya'
  //         AND a.INSTANSI <> '9999'
  //         AND a.COMPANY_CODE <> '9999'
  //         AND a.WERKS_NEW IS NOT NULL
  //         AND lower(a.NAMA) NOT LIKE '%dummy%'
  //         AND lower(a.NAMA) NOT LIKE '%user%'
  //         AND lower(a.NAMA) NOT LIKE '%test%'
  //         AND lower(a.NAMA) NOT LIKE '%sit -%'
  //         AND a.KD_DIV_ARSIP IS NOT NULL
  //         AND a.JENIS IS NOT NULL
  //     )
  //   ORDER BY
  //     c.KD_DIV_ARSIP,
  //     c.GRUP ASC
  //   OFFSET ${limit * (page - 1)} ROWS FETCH NEXT ${limit} ROWS ONLY
  //   `);
  // }

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

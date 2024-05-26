import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class AtasanBawahanPeoService {
  constructor(
    @InjectConnection('pelindo_peo') private readonly connection: Connection,
  ) {}

  async getAtasanBawahan({ page = 1, limit = 50, objid = '' }) {
    return await this.connection.query(`
      WITH
        ACCOUNT AS (
          SELECT
            CNAME,
            PNALT,
            COMPANY_CODE,
            ANSVH,
            SHORT,
            PGTXT,
            PKTXT,
            PLANS,
            PBTXT,
            BTRTX,
            LAST_UPDATED_DATE,
            KD_AKTIF,
            WERKS_NEW,
            WERKS,
            SUBDI,
            ROW_NUMBER () OVER (
              PARTITION BY PNALT
              ORDER BY
                LAST_UPDATED_DATE DESC
            ) AS rn
          FROM
            "SAFM_PERUBAHAN_ORGANISASI"
          WHERE
            KD_AKTIF = 'A'
            AND COMPANY_CODE = '1000'
            AND TO_CHAR (enda, 'ddmmyyyy') = '31129999'
            AND SHORT <> '99999999'
            AND CNAME <> 'DUMMY PCP'
            AND PGTXT <> 'Pensiun'
            AND PLANS NOT LIKE 'CPDMT'
        ),
        SORT_ACCOUNT AS (
          SELECT
            *
          FROM
            ACCOUNT
          WHERE
            RN = 1
        ),
        DEPT AS (
          SELECT
            SO.OBJID,
            SO.PARID,
            SO.SHORT,
            SO.LAST_UPDATED_DATE,
            SO.KD_AKTIF,
            SO.STEXT,
            SO.ENDDA,
            SO.CREATED_DATE,
            SO.COMPANY_CODE,
            SO.DESCBOBOTORGANISASI,
            SO.LEVELORGANISASI,
            SO.KODEUNITKERJA,
            SO.PERSA,
            SORT_ACCOUNT.WERKS,
            SORT_ACCOUNT.WERKS_NEW,
            ROW_NUMBER () OVER (
              PARTITION BY SO.OBJID
              ORDER BY
                SO.LAST_UPDATED_DATE DESC
            ) AS DRN
          FROM
            "SAFM_STRUKTUR_ORGANISASI" "SO"
            LEFT JOIN SORT_ACCOUNT ON SO.OBJID = SORT_ACCOUNT.SUBDI
          WHERE
            SO.COMPANY_CODE = '1000'
            AND SO.OTYPE IN ('O')
            AND TO_CHAR (SO.ENDDA, 'ddmmyyyy') = '31129999'
            AND TRUNC(SO.LAST_UPDATED_DATE) = TRUNC(sysdate)
            AND SO.KD_AKTIF = 'A'
        )
      SELECT
        *
      FROM
        DEPT
      WHERE
        DRN = 1
        ${objid ? 'AND OBJID = ' + objid : ''}
      ORDER BY
        LAST_UPDATED_DATE
      OFFSET ${limit * (page - 1)} ROWS FETCH NEXT ${limit} ROWS ONLY
    `);
  }

  async searchAtasanBawahan() {
    return await this.connection.query(`
      SELECT
          SO.OBJID,
          SO.PARID,
          SO.SHORT,
          SO.LAST_UPDATED_DATE,
          SO.KD_AKTIF,
          SO.STEXT,
          SO.ENDDA,
          SO.CREATED_DATE,
          SO.COMPANY_CODE,
          SO.DESCBOBOTORGANISASI,
          SO.LEVELORGANISASI,
          SO.KODEUNITKERJA,
          SO.PERSA
      FROM
          "SAFM_STRUKTUR_ORGANISASI" "SO"
      WHERE
          SO.COMPANY_CODE = '1000'
          AND UPPER(SO.STEXT) LIKE '%GROUP MANAJEMEN RISIKO%'
          AND SO.OTYPE IN ('O')
          AND TO_CHAR(SO.ENDDA, 'ddmmyyyy') = '31129999'
          AND TRUNC(SO.LAST_UPDATED_DATE) = TRUNC(sysdate)
          AND SO.KD_AKTIF = 'A'
      FETCH FIRST 10 ROWS ONLY
      `);
  }

  // async getAtasanBawahan({ page = 1, limit = 50, objid = '' }) {
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

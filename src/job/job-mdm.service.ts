import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class JobMDMService {
  constructor(
    @InjectConnection('pelindo_mdm') private readonly connection: Connection,
  ) {}

  async getJob({ page = 1, limit = 50 }) {
    return await this.connection
      .createQueryBuilder()
      .select('SHORT')
      .addSelect('PLANS')
      .addSelect('WERKS_NEW')
      .addSelect('LAST_UPDATED_DATE')
      .addSelect('CREATED_DATE')
      .from((subQuery) => {
        return (
          subQuery
            .select('CNAME')
            .addSelect('ANSVH')
            .addSelect('SHORT')
            .addSelect('PGTXT')
            .addSelect('PKTXT')
            .addSelect('PLANS')
            .addSelect('CREATED_DATE')
            .addSelect('LAST_UPDATED_DATE')
            .addSelect('KD_AKTIF')
            .addSelect('WERKS_NEW')
            .addSelect(
              `ROW_NUMBER () OVER (
              PARTITION BY SHORT
              ORDER BY
                LAST_UPDATED_DATE DESC
            ) AS rn`,
            )
            .from('SAFM_PERUBAHAN_ORGANISASI', '')
            .andWhere(`KD_AKTIF = 'A'`)
            // .andWhere(`COMPANY_CODE = '1000'`)
            // .andWhere(`OTYPE IN ('O')`)
            // .andWhere(`WERKS_NEW IN ('1000' ,'1310', '1320', '1330', '1340')`)
            .andWhere(`WERKS_NEW IN ('1000' ,'1310', '1320', '1330', '1340')`)
            .andWhere(`TO_CHAR (enda, 'ddmmyyyy') = '31129999'`)
            .andWhere(`TRUNC(LAST_UPDATED_DATE) = TRUNC(sysdate)`)
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
      .orderBy('SHORT')
      .limit(limit)
      .offset(limit * (page - 1))
      .getRawMany();
  }

  async getOneJob({ objId }) {
    return await this.connection
      .createQueryBuilder()
      .select('SHORT')
      .addSelect('PLANS')
      .addSelect('WERKS_NEW')
      .addSelect('LAST_UPDATED_DATE')
      .addSelect('CREATED_DATE')
      .from((subQuery) => {
        return (
          subQuery
            .select('CNAME')
            .addSelect('ANSVH')
            .addSelect('SHORT')
            .addSelect('PGTXT')
            .addSelect('PKTXT')
            .addSelect('PLANS')
            .addSelect('CREATED_DATE')
            .addSelect('LAST_UPDATED_DATE')
            .addSelect('KD_AKTIF')
            .addSelect('WERKS_NEW')
            .addSelect(
              `ROW_NUMBER () OVER (
              PARTITION BY SHORT
              ORDER BY
                LAST_UPDATED_DATE DESC
            ) AS rn`,
            )
            .from('SAFM_PERUBAHAN_ORGANISASI', '')
            .andWhere(`KD_AKTIF = 'A'`)
            .andWhere('SHORT = :objId', {objId})
            // .andWhere(`COMPANY_CODE = '1000'`)
            // .andWhere(`OTYPE IN ('O')`)
            // .andWhere(`WERKS_NEW IN ('1000' ,'1310', '1320', '1330', '1340')`)
            .andWhere(`WERKS_NEW IN ('1000' ,'1310', '1320', '1330', '1340')`)
            .andWhere(`TO_CHAR (enda, 'ddmmyyyy') = '31129999'`)
            .andWhere(`TRUNC(LAST_UPDATED_DATE) = TRUNC(sysdate)`)
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
      .orderBy('SHORT')
      .limit(1)
      .getRawOne();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class PegawaiPeoService {
  constructor(
    @InjectConnection('pelindo_peo') private readonly connection: Connection,
  ) {}

  async getPegawai({ page = 1, limit = 50, objid = '', nipp_new = '' }) {
    if (nipp_new) {
      return await this.connection.query(`      
        SELECT a.*
        FROM PSO_ROLE_PEGAWAI a
        WHERE 
          (
            a.GRUP IN ('PLTP', 'PLND')
            AND a.NIPP_BARU = '${nipp_new}'
            AND a.INSTANSI <> '9999'
            AND a.COMPANY_CODE <> '9999'
            AND a.WERKS_NEW IS NOT NULL
            AND lower(a.NAMA) NOT LIKE '%dummy%'
            AND lower(a.NAMA) NOT LIKE '%user%'
            AND lower(a.NAMA) NOT LIKE '%test%'
            AND lower(a.NAMA) NOT LIKE '%sit -%'
            AND a.KD_DIV_ARSIP IS NOT NULL
          )
        ORDER BY
          a.NIPP ASC
        OFFSET ${limit * (page - 1)} ROWS FETCH NEXT 1 ROWS ONLY
      `);
    } else {
      return await this.connection.query(`      
        SELECT a.*
        FROM PSO_ROLE_PEGAWAI a
        WHERE 
          (
            a.GRUP IN ('PLTP', 'PLND')
            AND a.INSTANSI <> '9999'
            AND a.COMPANY_CODE <> '9999'
            AND a.WERKS_NEW IS NOT NULL
            AND lower(a.NAMA) NOT LIKE '%dummy%'
            AND lower(a.NAMA) NOT LIKE '%user%'
            AND lower(a.NAMA) NOT LIKE '%test%'
            AND lower(a.NAMA) NOT LIKE '%sit -%'
            AND a.KD_DIV_ARSIP IS NOT NULL
          )
        ORDER BY
          a.NIPP ASC
        OFFSET ${limit * (page - 1)} ROWS FETCH NEXT ${limit} ROWS ONLY
      `);
    }
  }

  async getPegawaiByNippNew({ nipp_baru }) {
    return await this.connection.query(`      
    SELECT a.*
    FROM PSO_ROLE_PEGAWAI a
    WHERE 
      (
        a.GRUP IN ('PLTP', 'PLND')
        AND a.NIPP = '${nipp_baru}'
        AND a.INSTANSI <> '9999'
        AND a.COMPANY_CODE <> '9999'
        AND a.WERKS_NEW IS NOT NULL
        AND lower(a.NAMA) NOT LIKE '%dummy%'
        AND lower(a.NAMA) NOT LIKE '%user%'
        AND lower(a.NAMA) NOT LIKE '%test%'
        AND lower(a.NAMA) NOT LIKE '%sit -%'
        AND a.KD_DIV_ARSIP IS NOT NULL
      )
    ORDER BY
      a.NIPP ASC
    FETCH NEXT 1 ROWS ONLY
    `);
  }
}

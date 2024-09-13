import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class DivisiPeoService {
  constructor(
    @InjectConnection('pelindo_peo') private readonly connection: Connection,
  ) {}

  async getDivisi({ page = 1, limit = 50, objid = '', nipp_new = '' }) {
    if (nipp_new) {
      return await this.connection.query(`
        SELECT c.*, a.WERKS_NEW
        FROM PSO_DIVISI c
        JOIN (
          SELECT DISTINCT KD_DIV_ARSIP, KD_WIL_ARSIP, WERKS_NEW
          FROM PSO_ROLE_PEGAWAI
          WHERE GRUP IN ('PLTP', 'PLND')
            AND NIPP_BARU = '${nipp_new}'
            AND INSTANSI <> '9999'
            AND COMPANY_CODE <> '9999'
            AND WERKS_NEW IS NOT NULL
            AND lower(NAMA) NOT LIKE '%dummy%'
            AND lower(NAMA) NOT LIKE '%user%'
            AND lower(NAMA) NOT LIKE '%test%'
            AND lower(NAMA) NOT LIKE '%sit -%'
            AND KD_DIV_ARSIP IS NOT NULL
        ) a ON c.KD_DIV_ARSIP = a.KD_DIV_ARSIP 
          AND c.KD_WIL_ARSIP = a.KD_WIL_ARSIP
        WHERE c.KD_DIV_ARSIP IS NOT NULL
        ORDER BY c.KD_DIV_ARSIP, c.GRUP ASC    
        OFFSET ${limit * (page - 1)} ROWS FETCH NEXT 1 ROWS ONLY
      `);
    } else {
      return await this.connection.query(`
        SELECT c.*, a.WERKS_NEW
        FROM PSO_DIVISI c
        JOIN (
          SELECT DISTINCT KD_DIV_ARSIP, KD_WIL_ARSIP, WERKS_NEW
          FROM PSO_ROLE_PEGAWAI
          WHERE GRUP IN ('PLTP', 'PLND')
            AND INSTANSI <> '9999'
            AND COMPANY_CODE <> '9999'
            AND WERKS_NEW IS NOT NULL
            AND lower(NAMA) NOT LIKE '%dummy%'
            AND lower(NAMA) NOT LIKE '%user%'
            AND lower(NAMA) NOT LIKE '%test%'
            AND lower(NAMA) NOT LIKE '%sit -%'
            AND KD_DIV_ARSIP IS NOT NULL
        ) a ON c.KD_DIV_ARSIP = a.KD_DIV_ARSIP 
          AND c.KD_WIL_ARSIP = a.KD_WIL_ARSIP
        WHERE c.KD_DIV_ARSIP IS NOT NULL
        ORDER BY c.KD_DIV_ARSIP, c.GRUP ASC    
        OFFSET ${limit * (page - 1)} ROWS FETCH NEXT ${limit} ROWS ONLY
      `);
    }
  }
}

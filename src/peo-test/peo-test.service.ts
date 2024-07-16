import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class PeoTestService {
  constructor(
    @InjectConnection('pelindo_peo') private readonly connection: Connection,
  ) {}

  async findByQuery(query): Promise<any[]> {
    return await this.connection.query(query);
  }

  async findDivisi(): Promise<any[]> {
    const query = `
      SELECT *
      FROM PSO_DIVISI
      WHERE KD_WIL_ARSIP IN ('PLND', 'REG1', 'REG2', 'REG3', 'PLTP')
      FETCH FIRST 10 ROWS ONLY
    `;

    console.log(query);

    return await this.connection.query(query);
  }

  async findRolePegawai(): Promise<any[]> {
    const query = `
      SELECT a.*,
        CASE 
          WHEN a.INSTANSI = 'PLND' THEN 'PELINDO'
          ELSE 'SPTP'
        END AS PEGAWAI
      FROM PSO_ROLE_PEGAWAI a
      WHERE WERKS_NEW IN (
        '1000', '1310', '1320', '1330', '1340',
        '778', '878', '857', '617', '777', '797', '577',
        '1221', '1461', '1241', '1201', '879', '1981',
        '457', '637', '858', '877', '2002', '657', '779',
        '859', '860', '2001'
      )
      FETCH FIRST 10 ROWS ONLY
    `;

    console.log(query);

    return await this.connection.query(query);
  }

  async findAtasanBawahan(): Promise<any[]> {
    const query = `
      SELECT ab.*,
        CASE 
          WHEN ab.INSTANSI = 'PLND' THEN 'PELINDO'
          ELSE 'SPTP'
        END AS PEGAWAI
      FROM ATASAN_BAWAHAN ab 
      WHERE NIPP IN (
        SELECT DISTINCT NIPP
        FROM PSO_ROLE_PEGAWAI a
        WHERE WERKS_NEW IN (
          '1000','1310','1320','1330','1340',
          '778', '878', '857', '617', '777', '797', '577',
          '1221', '1461', '1241', '1201', '879', '1981',
          '457', '637', '858', '877', '2002', '657', '779',
          '859', '860', '2001'
        )
      )
      FETCH FIRST 10 ROWS ONLY
    `;

    console.log(query);

    return await this.connection.query(query);
  }
}

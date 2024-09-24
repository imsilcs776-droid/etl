import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { CompanyMvService } from 'src/mv-company/mv-company.service';
import { Connection } from 'typeorm';

@Injectable()
export class AtasanBawahanPeoService {
  constructor(
    @InjectConnection('pelindo_peo') private readonly connection: Connection,
    private companyMvService: CompanyMvService,
  ) { }

  async getAtasanBawahan({ page = 1, limit = 50, objid = '', nipp_new = '' }) {
    const comps = await this.companyMvService.getMvCompany()
    const grups = comps.map((comp) => comp.grup)
    const queryBuilder = this.connection
      .createQueryBuilder()
      .select('ATASAN_BAWAHAN.*, ATASAN_BAWAHAN.INSTANSI AS PEGAWAI')
      .from('ATASAN_BAWAHAN', 'ATASAN_BAWAHAN')
      .where('ATASAN_BAWAHAN.NIPP_BARU IS NOT NULL')
      .andWhere('ATASAN_BAWAHAN.NIPP_ATS_BARU IS NOT NULL')
      .andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('DISTINCT NIPP')
            .from('PSO_ROLE_PEGAWAI', 'PSO_ROLE_PEGAWAI')
            .where('PSO_ROLE_PEGAWAI.INSTANSI <> :instansi', { instansi: '9999' })
            .andWhere('PSO_ROLE_PEGAWAI.COMPANY_CODE <> :company_code', { company_code: '9999' })
            .andWhere('PSO_ROLE_PEGAWAI.WERKS_NEW IS NOT NULL')
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :dummy', { dummy: '%dummy%' })
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :user', { user: '%user%' })
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :test', { test: '%test%' })
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :sit', { sit: '%sit -%' })
            .andWhere('PSO_ROLE_PEGAWAI.KD_DIV_ARSIP IS NOT NULL')
            .andWhere('PSO_ROLE_PEGAWAI.GRUP IN (:...grups)', { grups: ['PLTP', 'PLND', ...grups] });

          if (nipp_new) {
            subQuery.andWhere('PSO_ROLE_PEGAWAI.NIPP_BARU = :nipp_new', { nipp_new: String(nipp_new).trim() });
          }

          return `ATASAN_BAWAHAN.NIPP IN ${subQuery.getQuery()}`;
        }
      )
      .orderBy('ATASAN_BAWAHAN.NIPP_BARU', 'ASC')
      .addOrderBy('ATASAN_BAWAHAN.NIPP_ATS_BARU', 'ASC')
      .offset(limit * (page - 1))
      .limit(limit);

    return await queryBuilder.execute();
  }


  // async getAtasanBawahan({ page = 1, limit = 50, objid = '', nipp_new = '' }) {
  //   if (nipp_new) {
  //     return await this.connection.query(`
  //       SELECT ab.*,ab.INSTANSI AS PEGAWAI
  //         FROM ATASAN_BAWAHAN ab 
  //         WHERE NIPP IN (
  //           SELECT DISTINCT NIPP
  //           FROM PSO_ROLE_PEGAWAI a
  //           WHERE a.GRUP IN ('PLTP', 'PLND')
  //             AND a.NIPP_BARU = '${nipp_new}'
  //             AND a.INSTANSI <> '9999'
  //             AND a.COMPANY_CODE <> '9999'
  //             AND a.WERKS_NEW IS NOT NULL
  //             AND lower(a.NAMA) NOT LIKE '%dummy%'
  //             AND lower(a.NAMA) NOT LIKE '%user%'
  //             AND lower(a.NAMA) NOT LIKE '%test%'
  //             AND lower(a.NAMA) NOT LIKE '%sit -%'
  //             AND a.KD_DIV_ARSIP IS NOT NULL
  //         )
  //         AND ab.NIPP_BARU IS NOT NULL
  //         AND ab.NIPP_ATS_BARU IS NOT NULL
  //       ORDER BY ab.NIPP_BARU, ab.NIPP_ATS_BARU ASC
  //       OFFSET ${limit * (page - 1)} ROWS FETCH NEXT 1 ROWS ONLY
  //   `);
  //   } else {
  //     return await this.connection.query(`
  //       SELECT ab.*,ab.INSTANSI AS PEGAWAI
  //         FROM ATASAN_BAWAHAN ab 
  //         WHERE NIPP IN (
  //           SELECT DISTINCT NIPP
  //           FROM PSO_ROLE_PEGAWAI a
  //           WHERE a.GRUP IN ('PLTP', 'PLND')
  //             AND a.INSTANSI <> '9999'
  //             AND a.COMPANY_CODE <> '9999'
  //             AND a.WERKS_NEW IS NOT NULL
  //             AND lower(a.NAMA) NOT LIKE '%dummy%'
  //             AND lower(a.NAMA) NOT LIKE '%user%'
  //             AND lower(a.NAMA) NOT LIKE '%test%'
  //             AND lower(a.NAMA) NOT LIKE '%sit -%'
  //             AND a.KD_DIV_ARSIP IS NOT NULL
  //         )
  //         AND ab.NIPP_BARU IS NOT NULL
  //         AND ab.NIPP_ATS_BARU IS NOT NULL
  //       ORDER BY ab.NIPP_BARU, ab.NIPP_ATS_BARU ASC
  //       OFFSET ${limit * (page - 1)} ROWS FETCH NEXT ${limit} ROWS ONLY
  //     `);
  //   }
  // }
}

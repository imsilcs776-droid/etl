import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { CompanyMvService } from 'src/mv-company/mv-company.service';
import { Connection } from 'typeorm';

@Injectable()
export class PegawaiPeoService {
  constructor(
    @InjectConnection('pelindo_peo') private readonly connection: Connection,
    private companyMvService: CompanyMvService,
  ) { }

  async getPegawai({ page = 1, limit = 50, objid = '', nipp_new = '' }) {
    const comps = await this.companyMvService.getMvCompany()
    const grups = comps.map((comp) => comp.grup)

    const queryBuilder = this.connection
      .createQueryBuilder()
      .select('*')
      .from('PSO_ROLE_PEGAWAI', 'PSO_ROLE_PEGAWAI')
      .where('PSO_ROLE_PEGAWAI.INSTANSI <> :instansi', { instansi: '9999' })
      .andWhere('PSO_ROLE_PEGAWAI.GRUP IN ( :...grups )', { grups: ['PLTP', 'PLND', ...grups] })
      .andWhere('PSO_ROLE_PEGAWAI.COMPANY_CODE <> :company_code', { company_code: '9999' })
      .andWhere('PSO_ROLE_PEGAWAI.WERKS_NEW IS NOT NULL')
      .andWhere('PSO_ROLE_PEGAWAI.EMAIL IS NOT NULL')
      .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :dummy', { dummy: '%dummy%' })
      .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :user', { user: '%user%' })
      .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :test', { test: '%test%' })
      .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :sit', { sit: '%sit -%' })
      .andWhere('PSO_ROLE_PEGAWAI.KD_DIV_ARSIP IS NOT NULL');

    // Apply NIPP_NEW filter if provided
    if (nipp_new) {
      queryBuilder.andWhere('PSO_ROLE_PEGAWAI.NIPP_BARU = :nipp_new', { nipp_new: String(nipp_new).trim() });
    }

    // Apply pagination
    queryBuilder
      .orderBy('PSO_ROLE_PEGAWAI.NIPP', 'ASC')
      .offset(limit * (page - 1))
      .limit(limit);

    // return queryBuilder.getQuery()

    return await queryBuilder.getRawMany()
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

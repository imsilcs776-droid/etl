import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { CompanyMvService } from 'src/mv-company/mv-company.service';
import { Connection } from 'typeorm';

@Injectable()
export class DivisiPeoService {
  constructor(
    @InjectConnection('pelindo_peo') private readonly connection: Connection,
    private companyMvService: CompanyMvService,
  ) { }

  async getDivisi({ page = 1, limit = 50, objid = '', nipp_new = '' }) {
    const comps = await this.companyMvService.getMvCompany()
    const grups = comps.map((comp) => comp.grup)

    const queryBuilder = this.connection
      .createQueryBuilder()
      .select('PSO_DIVISI.*, PSO_ROLE_PEGAWAI_DT.WERKS_NEW')
      .from('PSO_DIVISI', 'PSO_DIVISI')
      .innerJoin(
        (subQuery) => {
          const sq = subQuery
            .select('DISTINCT KD_DIV_ARSIP, KD_WIL_ARSIP, WERKS_NEW')
            .from('PSO_ROLE_PEGAWAI', 'PSO_ROLE_PEGAWAI')
            .where('PSO_ROLE_PEGAWAI.INSTANSI <> :instansi', { instansi: '9999' })
            .andWhere('PSO_ROLE_PEGAWAI.COMPANY_CODE <> :company_code', { company_code: '9999' })
            .andWhere('PSO_ROLE_PEGAWAI.WERKS_NEW IS NOT NULL')
            .andWhere('PSO_ROLE_PEGAWAI.EMAIL IS NOT NULL')
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :dummy', { dummy: '%dummy%' })
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :user', { user: '%user%' })
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :test', { test: '%test%' })
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :sit', { sit: '%sit -%' })
            .andWhere('PSO_ROLE_PEGAWAI.KD_DIV_ARSIP IS NOT NULL')
            .andWhere('PSO_ROLE_PEGAWAI.GRUP IN (:...grups)', { grups: ['PLTP', 'PLND', ...grups] });

          if (nipp_new) {
            sq.andWhere('PSO_ROLE_PEGAWAI.NIPP_BARU = :nipp_new', { nipp_new: String(nipp_new).trim() });
          }

          return sq
        },
        'PSO_ROLE_PEGAWAI_DT',
        'PSO_DIVISI.KD_DIV_ARSIP = PSO_ROLE_PEGAWAI_DT.KD_DIV_ARSIP AND PSO_DIVISI.KD_WIL_ARSIP = PSO_ROLE_PEGAWAI_DT.KD_WIL_ARSIP'
      )
      .where('PSO_DIVISI.KD_DIV_ARSIP IS NOT NULL')
      .andWhere('PSO_DIVISI.GRUP IN (:...grups)', { grups: ['PLTP', 'PLND', ...grups] })
      .orderBy('PSO_DIVISI.KD_DIV_ARSIP', 'ASC')
      .addOrderBy('PSO_DIVISI.GRUP', 'ASC')
      .offset(limit * (page - 1))
      .limit(limit);

    // Apply NIPP_NEW filter if provided

    return await queryBuilder.getRawMany();
  }
}

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
    const grups = comps.map((comp) => comp.grup).filter((grup) => !!grup);

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
            .andWhere('PSO_ROLE_PEGAWAI.GRUP IS NOT NULL')
            .andWhere('PSO_ROLE_PEGAWAI.NIPP_BARU IS NOT NULL')
            .andWhere('PSO_ROLE_PEGAWAI.COMPANY_CODE <> :company_code', { company_code: '9999' })
            .andWhere('PSO_ROLE_PEGAWAI.WERKS_NEW IS NOT NULL')
            .andWhere('PSO_ROLE_PEGAWAI.EMAIL IS NOT NULL')
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :dummy', { dummy: '%dummy%' })
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :user', { user: '%user%' })
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :test', { test: '%test%' })
            .andWhere('lower(PSO_ROLE_PEGAWAI.NAMA) NOT LIKE :sit', { sit: '%sit -%' })
            .andWhere('PSO_ROLE_PEGAWAI.KD_DIV_ARSIP IS NOT NULL')
            .andWhere('PSO_ROLE_PEGAWAI.GRUP IN (:...grups)', { grups: [...grups] });

          if (nipp_new) {
            sq.andWhere('PSO_ROLE_PEGAWAI.NIPP_BARU = :nipp_new', { nipp_new: String(nipp_new).trim() });
          }

          return sq
        },
        'PSO_ROLE_PEGAWAI_DT',
        'PSO_DIVISI.KD_DIV_ARSIP = PSO_ROLE_PEGAWAI_DT.KD_DIV_ARSIP AND PSO_DIVISI.KD_WIL_ARSIP = PSO_ROLE_PEGAWAI_DT.KD_WIL_ARSIP'
      )
      .where('PSO_DIVISI.KD_DIV_ARSIP IS NOT NULL')
      .andWhere('PSO_DIVISI.GRUP IN (:...grups)', { grups: [...grups] })
      .andWhere('PSO_DIVISI.IS_DELETED IS NULL')
      .orderBy('PSO_DIVISI.KD_DIV_ARSIP', 'ASC')
      .addOrderBy('PSO_DIVISI.GRUP', 'ASC')
      .offset(limit * (page - 1))
      .limit(limit);

    // Apply NIPP_NEW filter if provided

    return await queryBuilder.getRawMany();
  }

  async getDivisiWithPlh({ page = 1, limit = 50, objid = '', nipp_new = '' }) {
    const comps = await this.companyMvService.getMvCompany()
    const grups = comps.map((comp) => comp.grup).filter((grup) => !!grup);

    const qb = this.connection
      .createQueryBuilder()
      .select('PSO_DIVISI.*')
      .from('PSO_DIVISI', 'PSO_DIVISI')

      // LEFT JOIN PLH
      .leftJoin(
        (sub) =>
          sub
            .select(['KD_DIV', 'KD_WIL'])
            .distinct(true)
            .from('MASTER_PLH', 'MASTER_PLH'),
        'MASTER_PLH',
        'PSO_DIVISI.KD_DIV_ARSIP = MASTER_PLH.KD_DIV AND PSO_DIVISI.KD_WIL_ARSIP = MASTER_PLH.KD_WIL'
      )

      // LEFT JOIN ROLE
      .leftJoin(
        (sub) => {
          const s = sub
            .select(['KD_DIV_ARSIP', 'KD_WIL_ARSIP', 'NIPP_BARU'])
            .from('PSO_ROLE_PEGAWAI', 'R')
            .where('R.INSTANSI <> :instansi', { instansi: '9999' })
            .andWhere('R.NIPP_BARU IS NOT NULL')
            .andWhere('R.WERKS_NEW IS NOT NULL')
            .andWhere('R.EMAIL IS NOT NULL');

          if (nipp_new) {
            s.andWhere('R.NIPP_BARU = :nipp_new', { nipp_new: String(nipp_new).trim() });
          }

          return s;
        },
        'ROLE_PEG',
        'PSO_DIVISI.KD_DIV_ARSIP = ROLE_PEG.KD_DIV_ARSIP AND PSO_DIVISI.KD_WIL_ARSIP = ROLE_PEG.KD_WIL_ARSIP'
      )

      // === MASTER FILTER ===
      .where('PSO_DIVISI.KD_DIV_ARSIP IS NOT NULL')
      .andWhere('PSO_DIVISI.IS_DELETED IS NULL')
      .andWhere('PSO_DIVISI.GRUP IN (:...grups)', { grups })
      .andWhere('PSO_DIVISI.INSTANSI IN (:...grups)', { grups })

      // === LOGIC UTAMA ===
      // Ambil DIVISI jika:
      //   1. Ada di PLH, atau
      //   2. Ada ROLE, atau
      //   3. Tidak punya ROLE = ROLE_PEG.KD_DIV_ARSIP IS NULL
      .andWhere(`
        MASTER_PLH.KD_DIV IS NOT NULL
        OR ROLE_PEG.KD_DIV_ARSIP IS NOT NULL
        OR ROLE_PEG.KD_DIV_ARSIP IS NULL
      `)

      // ORDER
      .orderBy('PSO_DIVISI.KD_DIV_ARSIP', 'ASC')
      .addOrderBy('PSO_DIVISI.KD_WIL_ARSIP', 'ASC')
      .addOrderBy('PSO_DIVISI.GRUP', 'ASC')

      // PAGINATION
      .offset(limit * (page - 1))
      .limit(limit);

    return await qb.getRawMany();
  }
}

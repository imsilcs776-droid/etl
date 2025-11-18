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
    const grups = comps.map((comp) => comp.grup).filter((grup) => !!grup);

    const queryBuilder = this.connection
      .createQueryBuilder()
      .select('*')
      .from('PSO_ROLE_PEGAWAI', 'PSO_ROLE_PEGAWAI')
      .where('PSO_ROLE_PEGAWAI.INSTANSI <> :instansi', { instansi: '9999' })
      .andWhere('PSO_ROLE_PEGAWAI.GRUP IS NOT NULL')
      .andWhere('PSO_ROLE_PEGAWAI.NIPP_BARU IS NOT NULL')
      .andWhere('PSO_ROLE_PEGAWAI.GRUP IN ( :...grups )', { grups: [...grups] })
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

  async getPegawaiV2({ page = 1, limit = 50, objid = '', nipp_new = '' }) {
    const comps = await this.companyMvService.getMvCompany()
    const grups = comps.map((comp) => comp.grup).filter((grup) => !!grup);

    const qb = this.connection
      .createQueryBuilder()
      .select('*')
      .from('PSO_ROLE_PEGAWAI', 'PSO_ROLE_PEGAWAI');

    // ================================
    // 🔥 Kelompokkan semua FILTER NORMAL
    // ================================
    qb.where((qb2) => {
      const normal = qb2
        .subQuery()
        .select('1')
        .from('PSO_ROLE_PEGAWAI', 'P2')
        .where('P2.NIPP_BARU = PSO_ROLE_PEGAWAI.NIPP_BARU')
        .andWhere('P2.INSTANSI <> :instansi', { instansi: '9999' })
        .andWhere('P2.GRUP IS NOT NULL')
        .andWhere('P2.NIPP_BARU IS NOT NULL')
        .andWhere('P2.GRUP IN (:...grups)', { grups })
        .andWhere('P2.COMPANY_CODE <> :company_code', { company_code: '9999' })
        .andWhere('P2.WERKS_NEW IS NOT NULL')
        .andWhere('P2.EMAIL IS NOT NULL')
        .andWhere('lower(P2.NAMA) NOT LIKE :dummy', { dummy: '%dummy%' })
        .andWhere('lower(P2.NAMA) NOT LIKE :user', { user: '%user%' })
        .andWhere('lower(P2.NAMA) NOT LIKE :test', { test: '%test%' })
        .andWhere('lower(P2.NAMA) NOT LIKE :sit', { sit: '%sit -%' })
        .andWhere('P2.KD_DIV_ARSIP IS NOT NULL');

      // Tambah filter nipp kalau ada
      if (nipp_new) {
        normal.andWhere('P2.NIPP_BARU = :nipp_new', {
          nipp_new: String(nipp_new).trim(),
        });
      }

      return `EXISTS (${normal.getQuery()})`;
    });

    // =================================
    // 🔥 OR EXISTS MASTER_PLH
    // =================================
    qb.orWhere((qb2) => {
      const sq = qb2
        .subQuery()
        .select('1')
        .from('MASTER_PLH', 'MASTER_PLH')
        .where('MASTER_PLH.NIPP_PLH_BARU = PSO_ROLE_PEGAWAI.NIPP_BARU')
        .andWhere('MASTER_PLH.AKHIR > SYSDATE');   // ⬅️ untuk Oracle

      if (nipp_new) {
        sq.andWhere('MASTER_PLH.NIPP_PLH_BARU = :nipp_new', {
          nipp_new: String(nipp_new).trim(),
        });
      }

      return `EXISTS (${sq.getQuery()})`;
    });

    // ORDER + PAGINATION
    qb.orderBy('PSO_ROLE_PEGAWAI.NIPP', 'ASC')
      .offset(limit * (page - 1))
      .limit(limit);

    return await qb.getRawMany();
  }


}


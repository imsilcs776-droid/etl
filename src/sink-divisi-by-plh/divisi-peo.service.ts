import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { CompanyMvService } from 'src/mv-company/mv-company.service';
import { Connection } from 'typeorm';

@Injectable()
export class DivisiByPLHPeoService {
  constructor(
    @InjectConnection('pelindo_peo') private readonly connection: Connection,
    private companyMvService: CompanyMvService,
  ) { }

  async getDivisi({ page = 1, limit = 50, objid = '', nipp_new = '' }) {
    const comps = await this.companyMvService.getMvCompany()
    const grups = comps.map((comp) => comp.grup).filter((grup) => !!grup);

    const queryBuilder = this.connection
      .createQueryBuilder()
      .select('PSO_DIVISI.*')
      .from('PSO_DIVISI', 'PSO_DIVISI')
      .innerJoin(
        (inner) => {
          const sq = inner
            .select([
              'MASTER_PLH.KD_DIV AS KD_DIV',
              'MASTER_PLH.KD_WIL AS KD_WIL'
            ])
            .distinct(true)
            .from('MASTER_PLH', 'MASTER_PLH')
            .where('MASTER_PLH.INSTANSI IN (:...grups)', { grups });

          if (nipp_new) {
            sq.andWhere('MASTER_PLH.NIPP_PLH = :nipp_new', {
              nipp_new: String(nipp_new).trim()
            });
          }

          return sq;
        },
        'MASTER_PLH_DT',
        'PSO_DIVISI.KD_DIV_ARSIP = MASTER_PLH_DT.KD_DIV AND PSO_DIVISI.KD_WIL_ARSIP = MASTER_PLH_DT.KD_WIL'
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
}

import { Injectable } from '@nestjs/common';
import { CompaniesMvEntity } from './entities/companies.mv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class CompanyMvService {
  constructor(
    @InjectRepository(CompaniesMvEntity)
    private repositoryCompanyMv: Repository<CompaniesMvEntity>,
  ) {}

  async getMvCompany(): Promise<any> {
    return await this.repositoryCompanyMv.find({
      where: {
        is_active: true,
        deleted_at: IsNull(),
        code: Not(IsNull()),
        grup: Not(IsNull()),
      },
    });
  }
}

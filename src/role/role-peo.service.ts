import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class RolesPEOService {
  constructor(
    @InjectConnection('pelindo_portalsi') private readonly connection: Connection,
  ) {}

  async getRoles({ page = 1, limit = 50 }) {
    return await this.connection
      .createQueryBuilder()
      .select('*')
      .from('ROLES', '')
      .andWhere(`IDAPLIKASI = '4162'`)
      .limit(limit)
      .offset(limit * (page - 1))
      .getRawMany();
  }
}

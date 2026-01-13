import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class PrivilegesPortalsiService {
  constructor(
    @InjectConnection('pelindo_portalsi')
    private readonly connection: Connection,
  ) {}

  async getPrivileges({ page = 1, limit = 50, nipp_new = null }) {
    if (nipp_new) {
      return await this.connection
        .createQueryBuilder()
        .select('A.*')
        .addSelect('L.NIPP')
        .addSelect('L.NAMA')
        .from('AKSES', 'A')
        .innerJoin('USERLOGIN', 'L', 'A.IDUSER = L.ID')
        .innerJoin('ROLES', 'R', `R.ID = A.IDROLE AND R.IDAPLIKASI = '4162'`)
        .orderBy('A.ID')
        .where('L.NIPP = :nipp_new', { nipp_new })
        .limit(limit)
        .offset(limit * (page - 1))
        .getRawMany();
    }
    return await this.connection
      .createQueryBuilder()
      .select('A.*')
      .addSelect('L.NIPP')
      .addSelect('L.NAMA')
      .from('AKSES', 'A')
      .innerJoin('USERLOGIN', 'L', 'A.IDUSER = L.ID')
      .innerJoin('ROLES', 'R', `R.ID = A.IDROLE AND R.IDAPLIKASI = '4162'`)
      .orderBy('A.ID')
      .limit(limit)
      .offset(limit * (page - 1))
      .getRawMany();
  }

  async getPrivilegeByNipp({ nipp }) {
    return await this.connection
      .createQueryBuilder()
      .select('A.*')
      .addSelect('R.KETERANGAN')
      .addSelect('L.NIPP')
      .addSelect('L.NAMA')
      .from('AKSES', 'A')
      .innerJoin('USERLOGIN', 'L', 'A.IDUSER = L.ID')
      .innerJoin('ROLES', 'R', `R.ID = A.IDROLE AND R.IDAPLIKASI = '4162'`)
      .orderBy('A.ID')
      .andWhere('L.NIPP = :nipp', { nipp })
      .getRawMany();
  }
}

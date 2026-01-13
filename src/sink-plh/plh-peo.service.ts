import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class PlhPeoService {
  constructor(
    @InjectConnection('pelindo_peo') private readonly connection: Connection,
  ) {}

  async getPlh({ page = 1, limit = 50, objid = '', nipp_new = '' }) {
    if (nipp_new) {
      return await this.connection.query(`
          SELECT a.*
          FROM MASTER_PLH a
          WHERE a.NIPP_PLH = '${nipp_new}'
          ORDER BY a.ID ASC    
          OFFSET ${limit * (page - 1)} ROWS FETCH NEXT 1 ROWS ONLY
      `);
    } else {
      return await this.connection.query(`
          SELECT a.*
          FROM MASTER_PLH a
          ORDER BY a.ID ASC    
          OFFSET ${limit * (page - 1)} ROWS FETCH NEXT ${limit} ROWS ONLY
      `);
    }
  }
}

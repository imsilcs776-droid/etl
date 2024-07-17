import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class PlhPeoService {
  constructor(
    @InjectConnection('pelindo_peo') private readonly connection: Connection,
  ) {}

  async getPlh({ page = 1, limit = 50, objid = '' }) {
    return await this.connection.query(`
    SELECT a.*
    FROM MASTER_PLH a
    ORDER BY a.ID ASC    
    OFFSET ${limit * (page - 1)} ROWS FETCH NEXT ${limit} ROWS ONLY
    `);
  }
}

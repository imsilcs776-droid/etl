import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { delay } from 'src/utils/delay';
import { CreateRoleDto } from './dto/create-role.dto';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { RolesPEOService } from './role-peo.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private accountRepository: Repository<Role>,
    private readonly syncLogsService: SyncLogsService,
    private readonly rolePEOService: RolesPEOService,
  ) {}

  async processRoles() {
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const account = await this.getRoles({ page, limit });
      if (account && account.length) {
        await this.bulkInsert(account);
      } else {
        stop = true;
      }
      page++;
    }

    const processedAccount = await this.accountRepository.count({
      where: { source: 'IMS_INTEGRATION' },
    });
    const syncData = await this.syncLogsService.addLog({
      code: await this.accountRepository.metadata.tableName.toString(),
      updated_at: new Date(),
    });
    return { syncData, total: processedAccount };
  }

  async create(createAccountDto: CreateRoleDto) {
    try {
      const entity = this.accountRepository.create(createAccountDto);
      // return await this.accountRepository.update({ i_id: entity.i_id }, entity);
      return await this.accountRepository.upsert(entity, ['i_id']);
    } catch (e) {
      const { detail, code } = e || {};
      return await this.syncLogsService.addFailedLog({
        entity: await this.accountRepository.metadata.tableName.toString(),
        reason: detail || code,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  async bulkInsert(accounts = []) {
    let count = 0;

    while (count < accounts.length) {
      const { ID, KETERANGAN, IDAPLIKASI, PARENTID, STATUS } = accounts[count];

      const body = new Role();
      body.i_id = ID;
      body.name = KETERANGAN;
      body.code = KETERANGAN;
      body.i_status = STATUS;
      body.i_parent = PARENTID;
      body.source = 'IMS_INTEGRATION';
      // body.role = 'ce30a329-1956-4336-b23c-bbbeba4442d4';
      await this.create(body);
      count++;
    }

    return true;
  }

  async getRoles({ page, limit }): Promise<any> {
    console.log('pageLimit=>', page, limit);
    return await this.rolePEOService.getRoles({ page, limit });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { delay } from 'src/utils/delay';
import { CreateRoleDto } from './dto/create-role.dto';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { RolesPEOService } from './role-peo.service';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleMvRepository: Repository<Role>,
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

    const processedAccount = await this.roleMvRepository.count({
      where: { source: 'PORTALSI' },
    });
    const syncData = await this.syncLogsService.addLog({
      code: await this.roleMvRepository.metadata.tableName.toString(),
      updated_at: new Date(),
    });
    return { syncData, total: processedAccount };
  }

  async create(createAccountDto: CreateRoleDto) {
    try {
      const entity = this.roleMvRepository.create(createAccountDto);
      // return await this.roleMvRepository.update({ i_id: entity.i_id }, entity);
      return await this.roleMvRepository.upsert(entity, ['i_id']);
    } catch (e) {
      const { detail, code } = e || {};
      return await this.syncLogsService.addFailedLog({
        entity: await this.roleMvRepository.metadata.tableName.toString(),
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
      body.source = 'PORTALSI';
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

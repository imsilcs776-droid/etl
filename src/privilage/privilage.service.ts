import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Privilege } from './entities/privilage.entity';
import { delay } from 'src/utils/delay';
import { CreatePrivilegeDto } from './dto/privilage.dto';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { PrivilegesPortalsiService } from './privilage-peo.service';

@Injectable()
export class PrivilegesService {
  constructor(
    @InjectRepository(Privilege)
    private privilegeRepository: Repository<Privilege>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private syncLogService: SyncLogsService,
    private readonly privilegesPortasiService: PrivilegesPortalsiService,
  ) {}

  async deleteOldPrivilega() {
    return await this.privilegeRepository
      .createQueryBuilder()
      .delete()
      .from(Privilege)
      .andWhere('updated_at < CURRENT_DATE')
      .andWhere('source IN(:...src)', { src: ['PEO', 'IMS_INTEGRATION'] })
      .execute();
  }

  async processPrivilege() {
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const privileges = await this.getPrivileges({ page, limit });
      if (privileges && privileges.length) {
        await this.bulkInsert(privileges);
      } else {
        stop = true;
      }
      page++;
    }

    const processedPrivilege = await this.privilegeRepository.count({
      where: { source: In(['PEO', 'IMS_INTEGRATION']) },
    });
    // const syncData = await this.syncLogService.addLog({
    //   code: await this.privilegeRepository.metadata.tableName.toString(),
    //   updated_at: new Date(),
    // });
    return { total: processedPrivilege };
  }

  async bulkInsert(privileges = []) {
    let count = 0;

    const roles = await this.getRoles(privileges);
    const users = await this.getUsers(privileges);

    while (count < privileges.length) {
      const { ID, IDROLE, LAST_UPDATED_DATE, IDUSER, NIPP, NAMA } =
        privileges[count];

      const { id: roleId } = roles.find((role) => role.i_id == IDROLE) || {
        id: null,
      };

      const { id: userId } = users.find((user) => user.nip == NIPP) || {
        id: null,
      };

      if (roleId && userId) {
        const body = new Privilege();
        body.updated_at = new Date();
        body.created_at = new Date(LAST_UPDATED_DATE);
        body.source = 'PORTALSI';
        body.role = roleId;
        body.user = userId;
        body.i_id = String(ID);
        body.i_nip = NIPP;
        body.i_role = IDROLE;
        body.product = 1;

        await this.create(body);
      }
      count++;
    }

    return true;
  }

  async create(createPrivilegeDto: CreatePrivilegeDto) {
    try {
      const entity = this.privilegeRepository.create(createPrivilegeDto);
      return await this.privilegeRepository.upsert(entity, ['i_id']);
    } catch (e) {
      const { detail, code } = e || {};
      return await this.syncLogService.addFailedLog({
        entity: await this.privilegeRepository.metadata.tableName.toString(),
        reason: detail || code,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  async getRoles(privileges) {
    const roles = privileges.map(({ IDROLE }) => IDROLE);
    return await this.roleRepository.findBy({
      i_id: In([...new Set(roles)]),
    });
  }

  async getUsers(privileges) {
    const users = privileges.map(({ NIPP }) => NIPP);
    return await this.userRepository.findBy({
      nip: In([...new Set(users)]),
    });
  }

  /**
   * get privilege
   * @param {
   *  page, limit
   * }
   * @returns {
      "ID": number,
      "IDUSER": number,
      "IDROLE": number,
      "PROGRAM_NAME": "TOAD",
      "LAST_UPDATE_BY": "OUTH",
      "LAST_UPDATED_DATE": "2023-02-20T02:21:08.000Z",
      "KD_CABANG": null,
      "KD_TERMINAL": null,
      "PROFIT_CENTER": null,
      "NIPP": "string",
      "NAMA": "string"
  },
   */
  async getPrivileges({ page, limit }): Promise<any> {
    console.log('pageLimit=>', page, limit);
    return await this.privilegesPortasiService.getPrivileges({ page, limit });
  }
}

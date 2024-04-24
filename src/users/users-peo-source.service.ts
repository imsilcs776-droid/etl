import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { DEF_PW } from 'src/configs/datacore.config';
import { CreatePrivilegeDto } from 'src/privilage/dto/privilage.dto';
import { Privilege } from 'src/privilage/entities/privilage.entity';
import { RoleSystem } from 'src/role/entities/role-system.entity';
import { Role } from 'src/role/entities/role.entity';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { Connection, In, IsNull, Not, Repository } from 'typeorm';
import { CreateAccountPeoDto } from './dto/create-user-peo.dto';
import { CreateAccountDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserPEOSourceService {
  roleSystem: RoleSystem;
  constructor(
    @InjectConnection('pelindo_portalsi') private readonly connection: Connection,
    @InjectRepository(User)
    private accountRepository: Repository<User>,
    private readonly syncLogsService: SyncLogsService,
    @InjectRepository(RoleSystem)
    private roleSystemRepository: Repository<RoleSystem>,
    @InjectRepository(Privilege)
    private privilegeRepository: Repository<Privilege>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private syncLogService: SyncLogsService,
  ) {}

  async deletePrivilegeNotInNePriv(iIds: string[] = [], nipp) {
    if (iIds.length === 0 || !nipp) return false;

    return await this.privilegeRepository
      .createQueryBuilder()
      .delete()
      .from(Privilege)
      .andWhere('i_nip = :nipp', { nipp })
      .andWhere('i_id NOT IN ( :...iIds )', {
        iIds: iIds.map((iId) => String(iId)),
      })
      .andWhere(`source = 'IMS_INTEGRATION'`)
      .execute();
  }

  async processAccountSourcePeo(body: CreateAccountPeoDto) {
    /**
     * get system role
     */
    this.roleSystem = await this.roleSystemRepository.findOne({
      where: {
        name: 'Administrator',
      },
    });

    /**
     * add to user
     */
    const accounts = await this.getAccountPEO(body.nipps);

    let role = await this.roleRepository.findOne({
      where: { code: 'USER' },
    });

    if (role) {
      for (const nipp of body.nipps) {
        const user = await this.userRepository.findOne({
          where: { nip: nipp },
        });
        const priv = await this.privilegeRepository.findOne({
          where: { user: user.id, role: role.id },
        });
        if (!priv) {
          const userPayload = {
            user: user.id,
            role: role.id,
            product: 1,
            created_at: new Date(),
            updated_at: new Date(),
            source: 'MES-IMS',
            i_nip: nipp,
            i_id: null,
            i_role: null,
          };

          const entity = this.privilegeRepository.create(userPayload);
          await this.privilegeRepository.save(entity);
        }
      }
    }

    console.log(accounts);
    await this.bulkUpdate(accounts);

    /**
     * get akses from peo
     */
    const privsPeo = await this.connection
      .createQueryBuilder()
      .select('A.*')
      .addSelect('L.NIPP')
      .addSelect('L.NAMA')
      .from('AKSES', 'A')
      .innerJoin('USERLOGIN', 'L', 'A.IDUSER = L.ID')
      .innerJoin('ROLES', 'R', `R.ID = A.IDROLE AND R.IDAPLIKASI = '4162'`)
      .andWhere('L.NIPP IN ( :...nipps )', {
        nipps: body.nipps.map((nipp) => String(nipp)),
      })
      .orderBy('A.ID')
      .getRawMany();

    if (!privsPeo) throw new Error('Portal SI akses not found');

    /**
     * sync to privileges
     */
    await this.bulkInsertPrivileges(privsPeo);

    const syncData = await this.syncLogsService.addLog({
      code: await this.accountRepository.metadata.tableName.toString(),
      updated_at: new Date(),
    });

    const privData = await this.privilegeRepository.findBy({
      i_nip: In([...new Set(body.nipps)]),
    });
    return { syncData, data: privData };
  }

  async update(createAccountDto: CreateAccountDto) {
    try {
      /**
       * add account
       */
      return await this.accountRepository
        .createQueryBuilder()
        .insert()
        .orIgnore()
        .values(createAccountDto)
        .execute();
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

  async bulkUpdate(accounts = []) {
    let count = 0;

    while (count < accounts.length) {
      const { ID, NIPP, NAMA, EMAIL } = accounts[count];

      const fullNames = NAMA.split(' ');
      const [fsName] = fullNames;
      const lastName = fullNames[fullNames.length - 1];
      const body = new User();
      body.nip = NIPP;
      body.i_id = ID;
      body.first_name = fsName;
      body.last_name = lastName;
      body.email = EMAIL;
      body.full_name = NAMA;
      body.password = DEF_PW || 'L4n1usLab!';
      body.created_at = new Date();
      body.role = this.roleSystem.id;
      await this.update(body);
      count++;
    }

    return true;
  }

  /**
   * 
   * @param nipps 
   * @returns 
   * {
      "ID": 37080,
      "NIPP": "777",
      "NAMA": "QA SECURITY",
      "HAKAKSES": null,
      "EMAIL": "david.suryaputra@yahoo.co.id",
      "PROGRAM_NAME": "PORTALSI WEB",
      "LAST_UPDATE_BY": "37080-777",
      "LAST_UPDATED": "2023-04-04T14:45:40.000Z",
      "HP": "082335172947",
      "STATUS": "L",
      "PASSFAIL": 3,
      "CREATED_DATE": "2022-12-13T04:15:30.000Z",
      "MASA_BERLAKU": null,
      "CHANGE_PASSWORD_DATE": "2023-04-04T08:13:31.000Z",
      "LAST_LOGIN": "2023-04-04T08:19:51.000Z",
      "LAST_CHANGE_PASSWD": "2023-04-04T08:13:31.000Z"
  },
   */
  async getAccountPEO(nipps = []) {
    if (nipps.length === 0) return [];

    const userLogins = await this.connection
      .createQueryBuilder()
      .select('*')
      // .addSelect('NIPP')
      .from('USERLOGIN', '')
      .andWhere('NIPP IN ( :...nipps )', {
        nipps: nipps.map((nipp) => String(nipp)),
      })
      .getRawMany();

    return userLogins;
  }

  async bulkInsertPrivileges(privileges = []) {
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
        body.source = 'IMS_INTEGRATION';
        body.role = roleId;
        body.user = userId;
        body.i_id = String(ID);
        body.i_nip = NIPP;
        body.i_role = IDROLE;
        body.product = 1;

        await this.create(body);
      }

      const peoAksesIds = privileges.map((f) => f.ID);
      this.deletePrivilegeNotInNePriv(peoAksesIds, NIPP);

      count++;
    }

    return true;
  }

  async create(createPrivilegeDto: CreatePrivilegeDto) {
    try {
      // return await this.privilegeRepository.insert(createPrivilegeDto);
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
}

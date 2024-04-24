import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { delay } from 'src/utils/delay';
import { CreateAccountDto } from './dto/create-user.dto';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { UserMDMService } from './users-mdm.service';
import { RoleSystem } from 'src/role/entities/role-system.entity';
import { DEF_PW } from 'src/configs/datacore.config';

@Injectable()
export class UsersService {
  private roleSystem: RoleSystem;

  constructor(
    @InjectRepository(User)
    private accountRepository: Repository<User>,
    @InjectRepository(RoleSystem)
    private roleSystemRepository: Repository<RoleSystem>,
    private readonly syncLogsService: SyncLogsService,
    private readonly userMDMservice: UserMDMService,
  ) {}

  async getAccounts() {
    const limit = 100;
    let stop = false;
    let page = 1;

    /**
     * get system role
     */
    this.roleSystem = await this.roleSystemRepository.findOne({
      where: {
        name: 'Administrator',
      },
    });

    while (!stop) {
      await delay(500);
      const account = await this.getUsers({ page, limit });
      if (account && account.length) {
        await this.bulkInsert(account);
      } else {
        stop = true;
      }
      page++;
    }

    const processedAccount = await this.accountRepository.count({
      where: { nip: Not(IsNull()) },
    });
    const syncData = await this.syncLogsService.addLog({
      code: await this.accountRepository.metadata.tableName.toString(),
      updated_at: new Date(),
    });
    return { syncData, total: processedAccount };
  }

  async create(createAccountDto: CreateAccountDto) {
    try {
      const entity = this.accountRepository.create(createAccountDto);
      // return await this.accountRepository.update({ nip: entity.nip }, entity);
      return await this.accountRepository.upsert(entity, ['nip']);
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
      const {
        CNAME,
        PNALT,
        PNALT_NEW,
        COMPANY_CODE,
        ANSVH,
        SHORT,
        PGTXT,
        PKTXT,
        PLANS,
        PBTXT,
        BTRTX,
        LAST_UPDATED_DATE,
        WERKS_NEW,
        SUBDI,
        OFFICMAIL,
        ENDA,
      } = accounts[count];

      const full_names: string[] = String(CNAME).split(' ');
      const nameLegth = full_names.length;

      const body = new User();
      body.email = OFFICMAIL || `${PNALT}@mail.com`;
      body.full_name = CNAME + ' # ' + String(PLANS).split('#')[0];
      body.first_name = String(CNAME).split(' ')[0];
      body.last_name =
        nameLegth > 1 ? full_names[nameLegth - 1] : full_names[0];
      body.nip = PNALT;
      body.i_com_code = WERKS_NEW;
      body.i_department_code = SUBDI;
      body.password = DEF_PW || 'L4n1usLab!';
      body.updated_at = new Date(LAST_UPDATED_DATE);
      body.i_job_code = SHORT;
      body.i_job_name = String(PLANS).split('#')[0];
      body.i_werk = WERKS_NEW;
      body.role = this.roleSystem.id;
      body.company = 1;
      body.nip_new = PNALT_NEW;
      body.i_endda = ENDA;
      await this.create(body);
      count++;
    }

    return true;
  }

  async getUsers({ page, limit }): Promise<any> {
    console.log('pageLimit=>', page, limit);
    return await this.userMDMservice.getAccount({ page, limit });
  }
}



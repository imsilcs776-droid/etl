import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { delay } from 'src/utils/delay';
import { Connection, In, IsNull, Not, Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserPEOService {
  constructor(
    @InjectConnection('pelindo_portalsi') private readonly connection: Connection,
    @InjectRepository(User)
    private accountRepository: Repository<User>,
    private readonly syncLogsService: SyncLogsService,
  ) {}

  async processAccountPeo() {
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const account = await this.getAccountPEO({ page, limit });
      if (account && account.length) {
        await this.bulkUpdate(account);
      } else {
        stop = true;
      }
      page++;
    }

    const processedAccount = await this.accountRepository.count({
      where: { i_id: Not(IsNull()) },
    });
    const syncData = await this.syncLogsService.addLog({
      code: await this.accountRepository.metadata.tableName.toString(),
      updated_at: new Date(),
    });
    return { syncData, total: processedAccount };
  }

  async update(createAccountDto: CreateAccountDto) {
    try {
      const entity = this.accountRepository.create(createAccountDto);
      return await this.accountRepository.update({ nip: entity.nip }, entity);
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
      const { ID, NIPP } = accounts[count];

      const body = new User();
      body.nip = NIPP;
      body.i_id = ID;
      await this.update(body);
      count++;
    }

    return true;
  }

  async getAccountPEO({ page = 1, limit = 50 }) {
    const skip = (page - 1) * limit;
    const account = await this.accountRepository.find({
      take: limit,
      skip,
      where: {
        nip: Not(IsNull()),
      },
      order: {
        nip: 'ASC',
      },
    });

    if (account.length === 0) return [];

    const userLogins = await this.connection
      .createQueryBuilder()
      .select('ID')
      .addSelect('NIPP')
      .from('USERLOGIN', '')
      .andWhere('NIPP IN (:...accountNipps )', {
        accountNipps: account.map((acc) => acc.nip),
      })
      .getRawMany();

    console.log('page limit =>', page, limit);
    console.log('localAccounts_count =>', account.length);
    console.log('updateableUsers_count =>', userLogins.length);

    return userLogins;
  }
}

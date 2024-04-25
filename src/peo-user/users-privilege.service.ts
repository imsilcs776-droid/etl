import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Code, Connection, IsNull, Not, Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { CreatePrivilegeDto } from 'src/privilage/dto/privilage.dto';
import { PrivilegeMvEntity } from './entities/privilage.mv.entity';
import { UserMvEntity } from './entities/user.mv.entity';
import { RoleMvEntity } from 'src/peo-role/entity/role.mv.entity';

@Injectable()
export class UserPrivilegeService {
  constructor(
    @InjectRepository(PrivilegeMvEntity)
    private prefilegerepository: Repository<PrivilegeMvEntity>,
    @InjectRepository(UserMvEntity)
    private userRepository: Repository<UserMvEntity>,
    @InjectRepository(RoleMvEntity)
    private roleRepository: Repository<RoleMvEntity>,
    private syncLogService: SyncLogsService,
  ) {}

  public async processAccountRole() {
    const defPrivCount = await this.prefilegerepository.count({
      where: { source: 'MES-IMS' },
    });

    if (defPrivCount > 0) {
      return { total: defPrivCount };
    }

    let role = await this.roleRepository.findOne({
      where: { code: 'USER' },
    });

    if (!role) {
      const _role = await this.roleRepository.create({
        code: 'USER',
        name: 'User',
        description: 'User',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
        source: 'MES-IMS',
      });

      role = await this.roleRepository.save(_role);
    }

    const limit = 500;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const userPrivilege = await this.updateUser({
        page,
        limit,
        role,
      });
      if (userPrivilege.length === 0) {
        stop = true;
      }
      page++;
    }

    const processedAccount = await this.prefilegerepository.count({
      where: { source: 'MES-IMS' },
    });
    // const syncData = await this.syncLogService.addLog({
    //   code: await this.prefilegerepository.metadata.tableName.toString(),
    //   updated_at: new Date(),
    // });
    return { total: processedAccount };
  }

  private async updateUser({ page, limit: take, role }) {
    const skip = (page - 1) * take;
    const account = await this.userRepository.find({
      take,
      skip,
      select: ['id'],
      order: {
        nip: 'ASC',
      },
    });

    const body: CreatePrivilegeDto[] = account.map((acc) => {
      return {
        user: acc.id,
        role: role.id,
        product: 1,
        created_at: new Date(),
        updated_at: new Date(),
        source: 'MES-IMS',
        i_nip: acc.nip,
        i_id: null,
        i_role: null,
      };
    });

    await this.prefilegerepository
      .createQueryBuilder()
      .insert()
      .values(body)
      .execute();

    return account;
  }
}

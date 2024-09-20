import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { Privilege } from 'src/privilage/entities/privilage.entity';
import { CreatePrivilegeDto } from 'src/privilage/dto/privilage.dto';
import { Role } from 'src/role/entities/role.entity';
import { UserMvEntity } from 'src/peo-user/entities/user.mv.entity';

@Injectable()
export class ImsPrivilegeService {
  constructor(
    @InjectRepository(Privilege)
    private prefilegerepository: Repository<Privilege>,
    @InjectRepository(UserMvEntity)
    private userRepository: Repository<UserMvEntity>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private syncLogService: SyncLogsService,
  ) { }

  public async processAccountRole() {
    let role = await this.roleRepository.findOne({
      where: { code: 'USER' },
    });

    /**
     * membuat role jika tidak ada
     */
    if (!role) {
      const _role = this.roleRepository.create({
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

    const [{ count_user_no_role }] = await this.userRepository
      .createQueryBuilder('u')
      .select('count(*) as count_user_no_role')
      .leftJoin('Privileges', 'r', 'u.id = r.user')
      .where('r.user IS NULL')
      .execute();

    if (!Number(count_user_no_role)) {
      return { count_user_no_role, total: count_user_no_role };
    }
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
    const syncData = await this.syncLogService.addLog({
      code: this.prefilegerepository.metadata.tableName.toString(),
      updated_at: new Date(),
    });
    return { syncData, total: processedAccount };
  }

  private async updateUser({ page, limit: take, role }) {
    const skip = (page - 1) * take;

    const account = await this.userRepository
      .createQueryBuilder('u')
      .select('u.*')
      .limit(take)
      .skip(skip)
      .leftJoin('Privileges', 'r', 'u.id = r.user')
      .where('r.user IS NULL')
      .execute();

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

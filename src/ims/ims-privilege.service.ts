import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { delay } from 'src/utils/delay';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { Privilege } from 'src/privilage/entities/privilage.entity';
import { Role } from 'src/role/entities/role.entity';
import { UserMvEntity } from 'src/peo-user/entities/user.mv.entity';

@Injectable()
export class ImsPrivilegeService {
  private readonly logger = new Logger(ImsPrivilegeService.name);

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
    // 🔹 1. Pastikan role USER tersedia
    let role = await this.roleRepository.findOne({
      where: { code: 'USER' },
    });

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

    // 🔹 2. Hitung jumlah user yang tidak punya role USER
    const { count_user_no_role } = await this.userRepository
      .createQueryBuilder('u')
      .select('COUNT(*)', 'count_user_no_role')
      .where(`NOT EXISTS (
        SELECT 1
        FROM "Privileges" r
        JOIN roles a ON a.id = r.role
        WHERE a.code = :code AND r.user = u.id
      )`, { code: 'USER' })
      .getRawOne();

    // Jika semua user sudah punya role USER
    if (!Number(count_user_no_role)) {
      return { count_user_no_role, total: count_user_no_role };
    }

    // 🔹 3. Masukkan role USER ke user yang belum punya
    // (gunakan batch untuk performa jika dataset besar)
    const limit = 500;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);

      const users = await this.userRepository
        .createQueryBuilder('u')
        .where(`NOT EXISTS (
          SELECT 1
          FROM "Privileges" r
          JOIN roles a ON a.id = r.role
          WHERE a.code = :code AND r.user = u.id
        )`, { code: 'USER' })
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      if (users.length === 0) {
        stop = true;
        break;
      }

      const insertValues = users.map((u) => ({
        user: u.id,
        role: role.id,
        source: 'MES-IMS',
        created_at: new Date(),
        updated_at: new Date(),
      }));

      await this.prefilegerepository
        .createQueryBuilder()
        .insert()
        .into('Privileges')
        .values(insertValues)
        .orIgnore() // 🔹 cegah duplikat (jika ada unique index user+role)
        .execute();

      this.logger.log(`Inserted ${insertValues.length} privileges (page ${page})`);

      page++;
    }

    // 🔹 4. Logging hasil sinkronisasi
    const processedAccount = await this.prefilegerepository.count({
      where: { source: 'MES-IMS' },
    });

    const syncData = await this.syncLogService.addLog({
      code: this.prefilegerepository.metadata.tableName.toString(),
      updated_at: new Date(),
    });

    return { syncData, total: processedAccount };
  }
}

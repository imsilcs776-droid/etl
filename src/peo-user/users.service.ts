import { Injectable } from '@nestjs/common';
import { UserMvEntity } from './entities/user.mv.entity';
import { And, ILike, IsNull, Like, Not, Repository } from 'typeorm';
import { RolePeoEntity } from 'src/peo-role/entity/role.peo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { delay } from 'src/utils/delay';
import { CreateAccountDto } from './dto/create-user.mv.dto';
import { DEF_PW } from 'src/configs/datacore.config';
import { RoleSystem } from 'src/role/entities/role-system.entity';
import { RoleMvEntity } from 'src/peo-role/entity/role.mv.entity';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import * as moment from 'moment';

@Injectable()
export class UsersService {
  roleSystem: RoleSystem;
  role: RoleMvEntity;
  constructor(
    @InjectRepository(UserMvEntity)
    private repositoryUserMv: Repository<UserMvEntity>,
    @InjectRepository(RolePeoEntity)
    private repositoryRolePegawaiPeo: Repository<RolePeoEntity>,
    private syncLogService: SyncLogsService,
    @InjectRepository(RoleSystem)
    private roleSystemRepository: Repository<RoleSystem>,
  ) {}

  public async processUser() {
    /**
     * get system role
     */
    this.roleSystem = await this.roleSystemRepository.findOne({
      where: {
        name: 'Administrator',
      },
    });
    const limit = 100;
    let stop = false;
    let page = 1;

    while (!stop) {
      await delay(500);
      const data = await this.getPeoPegawai({
        page,
        limit,
      });
      if (data && data.length) {
        await this.bulkInsert(data);
      } else {
        stop = true;
      }
      page++;
    }

    const totalDeleted = await this.setDeletedUsers();

    const processedUser = await this.repositoryUserMv.count({
      where: { source: 'PEO' },
    });

    const totalInactive = await this.repositoryUserMv.count({
      where: { is_active: false },
    });
    return { total: processedUser, totalInactive, totalDeleted };
  }

  private async bulkInsert(users: RolePeoEntity[] = []) {
    const now = moment().toDate();
    let count = 0;

    while (count < users.length) {
      const {
        email,
        nipp_baru,
        nama,
        nama_jabatan,
        nipp,
        pegawai,
        last_updated_date,
        werks_new,
        kd_cabang_sap,
        nama_cabang,
        kd_sub,
        kd_wil_arsip,
        kd_div_arsip,
      } = users[count];

      const full_names: string[] = String(nama).split(' ');
      const nameLegth = full_names.length;

      const body = new UserMvEntity();
      body.email = email?.includes('@')
        ? email.toUpperCase()
        : `${nipp_baru}@MAIL.COM`;
      body.full_name = nama + ' # ' + String(nama_jabatan);
      body.first_name = String(nama).split(' ')[0];
      body.last_name =
        nameLegth > 1 ? full_names[nameLegth - 1] : full_names[0];
      body.nip = nipp;
      body.i_com_code = werks_new;
      body.pegawai = pegawai;
      //   body.i_department_code = SUBDI;
      body.password = DEF_PW || 'L4n1usLab!';
      body.updated_at = now;
      //   body.i_job_code = SHORT;
      //   body.i_job_name = String(PLANS).split('#')[0];
      body.i_werk = werks_new;
      body.role = this.roleSystem.id;
      body.company = 1;
      body.nip_new = nipp_baru;
      body.i_endda = '9999-12-31';
      body.source = 'PEO';
      body.i_nama_cabang = nama_cabang;
      body.instansi = pegawai;
      body.i_kd_sub = kd_sub;
      body.i_kd_wil = kd_wil_arsip;
      body.is_active = true;
      body.i_kd_div = kd_div_arsip;
      await this.create(body);
      count++;
    }

    return true;
  }

  /**
   * get User
   * @param {
   *  page, limit, objid
   * }
   * @returns [OBJID,PARID,CREATED_DATE,LAST_UPDATED_DATE,COMPANY_CODE,STEXT,PERSA,WERKS_NEW]
   */
  private async getPeoPegawai({ page, limit }): Promise<any> {
    return await this.repositoryRolePegawaiPeo
      .createQueryBuilder()
      .where(
        `updated_at > COALESCE((SELECT MAX(updated_at) FROM directus_users), '1970-01-01')`,
      )
      .andWhere(`nipp IS NOT NULL`)
      .andWhere(`kd_div_arsip IS NOT NULL`)
      .andWhere(`kd_wil_arsip IS NOT NULL`)
      .andWhere(`email IS NOT NULL`)
      .andWhere('updated_at IS NOT NULL')
      .orderBy('nipp', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  /**
   * set deleted departments
   * ketikan ada mv_department yang updated_at nya kurang dari updated_at terakhir di peo_divisi
   * @returns true
   */
  private async setDeletedUsers(): Promise<number> {
    try {
      const result = await this.repositoryUserMv
        .createQueryBuilder()
        .update('directus_users')
        .set({ is_active: false })
        .where(
          'directus_users.updated_at < (SELECT MAX(updated_at) FROM peo_role)',
        )
        .orWhere('directus_users.updated_at IS NULL')
        .execute();

      const affectedRows = result.affected || 0; // Get the count of affected rows

      console.log(`Number of rows updated to is_active false: ${affectedRows}`);

      return affectedRows;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  private async create(createAccountDto: CreateAccountDto) {
    try {
      const existingRecord = await this.repositoryUserMv.findOne({
        where: {
          nip_new: createAccountDto.nip_new,
        },
      });

      if (existingRecord) {
        await this.repositoryUserMv.update(existingRecord.id, createAccountDto);
      } else {
        await this.repositoryUserMv.insert(createAccountDto);
      }

      return;

      // const entity = this.repositoryUserMv.create(createAccountDto);
      // // return await this.accountRepository.update({ nip: entity.nip }, entity);
      // return await this.repositoryUserMv.upsert(entity, ['nip']);
    } catch (e) {
      const { detail, code } = e || {};
      const now = moment().toDate();
      return await this.syncLogService.addFailedLog({
        entity: await this.repositoryUserMv.metadata.tableName.toString(),
        reason: detail || code,
        created_at: now,
        updated_at: now,
      });
    }
  }
}

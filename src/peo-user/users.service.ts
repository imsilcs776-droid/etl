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

@Injectable()
export class UsersService {
  roleSystem: RoleSystem;
  role: RoleMvEntity;
  constructor(
    @InjectRepository(UserMvEntity)
    private repositoryUserMv: Repository<UserMvEntity>,
    @InjectRepository(RolePeoEntity)
    private repositoryRolePegawaiPeo: Repository<RolePeoEntity>,
    @InjectRepository(RoleSystem)
    private roleSystemRepository: Repository<RoleSystem>,
    @InjectRepository(RoleMvEntity)
    private roleMvRepository: Repository<RoleMvEntity>,
    private syncLogService: SyncLogsService,
  ) {}

  public async processUser() {
    this.role = await this.roleMvRepository.findOne({
      where: { code: 'USER' },
    });
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
      const { data } = await this.getPeoPegawai({
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

    const processedUser = await this.repositoryUserMv.count({
      where: { source: 'PEO' },
    });
    return { total: processedUser };
  }

  private async bulkInsert(users: RolePeoEntity[] = []) {
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
      body.updated_at = new Date();
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
    const [data, total] = await this.repositoryRolePegawaiPeo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        nipp: Not(IsNull()),
        nipp_baru: Not(IsNull()),
        nama: And(
          Not(ILike('%test%')),
          Not(ILike('%pekerja%')),
          Not(ILike('%travel%')),
          Not(ILike('sit %')),
          Not(ILike('user%')),
          Not(ILike('dummy%')),
          Not(ILike('bios%')),
        ),
        email: And(
          Not(IsNull()),
          Not(ILike('ABC%')),
          Not(ILike('ALIFPRASETYOAJI97%')),
        ),
        kd_div_arsip: Not(IsNull()),
        kd_wil_arsip: Not(IsNull()),
      },
      order: {
        nipp: 'ASC',
      },
    });
    return { data, total };
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
      return await this.syncLogService.addFailedLog({
        entity: await this.repositoryUserMv.metadata.tableName.toString(),
        reason: detail || code,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }
}

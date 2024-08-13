import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { CreatePrivilegeDto } from 'src/privilage/dto/privilage.dto';
import { Role } from 'src/role/entities/role.entity';
import { UserMvEntity } from './entities/user.mv.entity';
import { RolePeoEntity } from 'src/peo-role/entity/role.peo.entity';
import { PegawaiPeoService } from 'src/sink-pegawai/pegawai-peo.service';
import { PrivilegesPortalsiService } from 'src/privilage/privilage-portalsi.service';
import { DepartmentMvEntity } from 'src/peo-department/entities/department.mv.entity';
import { CreateAccountDto } from './dto/create-user.mv.dto';
import { DEF_PW } from 'src/configs/datacore.config';
import * as moment from 'moment';
import { RoleSystem } from 'src/role/entities/role-system.entity';
import { PrivilegeMvEntity } from './entities/privilage.mv.entity';

@Injectable()
export class UsersMutationService {
  constructor(
    @InjectRepository(RolePeoEntity)
    private accountRepository: Repository<RolePeoEntity>,
    @InjectRepository(DepartmentMvEntity)
    private departmentRepository: Repository<DepartmentMvEntity>,
    @InjectRepository(PrivilegeMvEntity)
    private privilegeRepository: Repository<PrivilegeMvEntity>,
    @InjectRepository(UserMvEntity)
    private userMvRepository: Repository<UserMvEntity>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly pegawaiPeoService: PegawaiPeoService,
    private readonly privilegesPortalsiService: PrivilegesPortalsiService,
    private readonly syncLogsService: SyncLogsService,
    @InjectRepository(RoleSystem)
    private roleSystemRepository: Repository<RoleSystem>,
  ) {}

  private convertKeysToLowerSnakeCase(obj): any {
    const newObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = key.toLowerCase();
            newObj[newKey] = obj[key];
        }
    }
    return newObj;
}

  async currentAccount(nipp_baru: string) {
    const user = await this.accountRepository.findOne({
      where: {
        nipp_baru,
      },
    });

    const [new_user] = await this.pegawaiPeoService.getPegawaiByNippNew({
      nipp_baru,
    });
    if (!new_user) {
      throw new Error('user not exist, call help desk');
    }

    const convertedNewUserObject = this.convertKeysToLowerSnakeCase(new_user);


    let privsNew = [];
    if (convertedNewUserObject) {
      privsNew = await this.privilegesPortalsiService.getPrivilegeByNipp({
        nipp: convertedNewUserObject?.nipp_baru,
      });
    }

    const convertedPrivNew = privsNew.map(e=> this.convertKeysToLowerSnakeCase(e))

    return {
      data: {
        old_user: user,
        new_user: {
          ...convertedNewUserObject,
          privsNew: convertedPrivNew,
        },
      },
    };
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

  async createPrivilage(createPrivilegeDto: CreatePrivilegeDto) {
    try {
      const entity = this.privilegeRepository.create(createPrivilegeDto);
      return await this.privilegeRepository.upsert(entity, ['i_id']);
    } catch (e) {}
  }

  async syncCurrentAccount(nipp_new: string) {
    const now = moment().toDate();

    /**
     * get system role
     */
    const roleSystem = await this.roleSystemRepository.findOne({
      where: {
        name: 'Administrator',
      },
    });

    const currentUser = await this.userMvRepository.findOne({
      where: {
        nip_new:nipp_new,
      },
    });

    const [new_user] = await this.pegawaiPeoService.getPegawaiByNippNew({
      nipp_baru: nipp_new,
    });
    if (!new_user || !currentUser) {
      throw new Error('user not exist, call help desk');
    }

    const convertedNewUserObject = this.convertKeysToLowerSnakeCase(new_user);

    const { id: departmentId } =
      (await this.departmentRepository.findOne({
        where: { code: convertedNewUserObject.kd_div_arsip, i_kd_wil: convertedNewUserObject.kd_wil_arsip },
      })) || {};

    if (!departmentId) {
      throw new Error('department not exist, call help desk');
    }

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
    } = convertedNewUserObject;

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
    body.role = roleSystem.id;
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

    const privsNew = await this.privilegesPortalsiService.getPrivilegeByNipp({
      nipp: nipp_new,
    });
    const [{ IDROLE }] = privsNew || [{}];

    if (IDROLE) {
      const userRole = await this.roleRepository.findOne({
        where: {
          code: 'USER',
        },
      });
      let role = await this.privilegeRepository.findOne({
        where: { user: currentUser.id, role: userRole?.id },
      });

      /**
       * membuat role jika tidak ada
       */
      if (!role) {
        const body = new PrivilegeMvEntity();
        body.updated_at = now;
        body.created_at = now;
        body.source = 'PORTALSI';
        body.role = userRole.id;
        body.user = currentUser.id;
        body.i_nip = convertedNewUserObject.nipp_new;
        body.product = 1;

        const entity = this.privilegeRepository.create(body);
        await this.privilegeRepository.save(entity);
      }

      const roleCurrent = await this.roleRepository.findOne({
        where: {
          i_id: IDROLE,
        },
      });

      if (roleCurrent) {
        const body = new PrivilegeMvEntity();
        body.updated_at = now;
        body.created_at = now;
        body.source = 'PORTALSI';
        body.role = roleCurrent.id;
        body.user = currentUser.id;
        body.i_id = String(IDROLE);
        body.i_nip = convertedNewUserObject.nipp_new;
        body.i_role = IDROLE;
        body.product = 1;

        console.log(body);

        await this.createPrivilage(body);
      }
    }

    const convertedPrivNew = privsNew.map(e=> this.convertKeysToLowerSnakeCase(e))

    return {
      data: {
        new_user: {
          ...convertedNewUserObject,
          privsNew:convertedPrivNew,
        },
      },
    };
  }
}

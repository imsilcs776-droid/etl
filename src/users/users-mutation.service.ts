import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserMDMService } from './users-mdm.service';
import { DepartmentMDMService } from 'src/department/department-mdm.service';
import { JobMDMService } from 'src/job/job-mdm.service';
import { Department } from 'src/department/entities/department.entity';
import { CreateAccountDto } from './dto/create-user.dto';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { CreatePrivilegeDto } from 'src/privilage/dto/privilage.dto';
import { Privilege } from 'src/privilage/entities/privilage.entity';
import { Job } from 'src/job/entities/job.entity';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class UsersMutationService {
  constructor(
    @InjectRepository(User)
    private accountRepository: Repository<User>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Privilege)
    private privilegeRepository: Repository<Privilege>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly userMDMservice: UserMDMService,
    private readonly departmentMDMService: DepartmentMDMService,
    private readonly jobMDMService: JobMDMService,
    private readonly privilegesPEOService: any,
    private readonly syncLogsService: SyncLogsService,
  ) {}

  async currentAccount(nip_new: string) {
    const user = await this.accountRepository.findOne({
      where: {
        nip_new,
      },
      relations: ['department_details', 'job_details', 'roles'],
    });

    const new_user = await this.userMDMservice.getAccByNippNew({
      nipp_new: nip_new,
    });
    if (!new_user) {
      throw new Error('user not exist, call help desk');
    }

    let existing = {
      department: null,
      job: null,
    };
    let depNew = {};
    let jobNew = {};
    let privsNew = [];
    if (new_user) {
      depNew = await this.departmentMDMService.getDepartment({
        limit: 1,
        objid: new_user.SUBDI,
      });
      jobNew = await this.jobMDMService.getOneJob({ objId: new_user.SHORT });
      privsNew = await this.privilegesPEOService.getPrivilegeByNipp({
        nipp: new_user.PNALT_NEW,
      });

      const { id } =
        (await this.departmentRepository.findOne({
          where: { i_objid: new_user.SUBDI },
        })) || {};
      const { id: jobId } =
        (await this.jobRepository.findOne({
          where: { i_objid: new_user.SHORT },
        })) || {};

      if (id) {
        existing.department = id;
      }

      if (jobId) {
        existing.job = jobId;
      }
    }

    return {
      data: {
        existing,
        old_user: user,
        new_user: {
          ...new_user,
          depNew,
          jobNew,
          privsNew,
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

  async syncCurrentAccount(nip_new: string) {
    const currentUser = await this.accountRepository.findOne({
      where: {
        nip_new,
      },
    });
    const new_user = await this.userMDMservice.getAccByNippNew({
      nipp_new: nip_new,
    });
    if (!new_user || !currentUser) {
      throw new Error('user not exist, call help desk');
    }

    const { id: departmentId } =
      (await this.departmentRepository.findOne({
        where: { i_objid: new_user.SUBDI },
      })) || {};
    const { id: job } =
      (await this.jobRepository.findOne({
        where: { i_objid: new_user.SHORT },
      })) || {};
    let jobId = job;

    if (!departmentId) {
      throw new Error('department and job not exist, call help desk');
    }

    if (!jobId) {
      const jobNew = await this.jobMDMService.getOneJob({
        objId: new_user.SHORT,
      });
      const { SHORT, PLANS, WERKS_NEW, LAST_UPDATED_DATE, CREATED_DATE } =
        jobNew;

      const bodyJob = new Job();
      bodyJob.code = SHORT;
      bodyJob.name = PLANS;
      bodyJob.description = PLANS;
      bodyJob.is_active = true;
      bodyJob.updated_at = new Date(LAST_UPDATED_DATE);
      bodyJob.created_at = new Date(CREATED_DATE);
      bodyJob.source = 'IMS_INTEGRATION';
      bodyJob.i_com_code = WERKS_NEW;
      bodyJob.i_objid = SHORT;

      await this.jobRepository.upsert(bodyJob, ['i_objid']);
      const { id: job } =
        (await this.jobRepository.findOne({
          where: { i_objid: new_user.SHORT },
        })) || {};
      jobId = job;
    }

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
    } = new_user;

    const full_names: string[] = String(CNAME).split(' ');
    const nameLegth = full_names.length;

    const body = new User();
    body.email = OFFICMAIL || `${PNALT}@mail.com`;
    body.full_name = CNAME + ' # ' + String(PLANS).split('#')[0];
    body.first_name = String(CNAME).split(' ')[0];
    body.last_name = nameLegth > 1 ? full_names[nameLegth - 1] : full_names[0];
    body.nip = PNALT;
    body.i_com_code = WERKS_NEW;
    body.i_department_code = SUBDI;
    body.updated_at = new Date(LAST_UPDATED_DATE);
    body.i_job_code = SHORT;
    body.i_job_name = String(PLANS).split('#')[0];
    body.i_werk = WERKS_NEW;
    body.company = 1;
    body.nip_new = PNALT_NEW;
    body.i_endda = ENDA;
    body.department = departmentId;
    body.job = jobId;
    await this.create(body);

    const privsNew = await this.privilegesPEOService.getPrivilegeByNipp({
      nipp: new_user.PNALT_NEW,
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
        const body = new Privilege();
        body.updated_at = new Date();
        body.created_at = new Date(LAST_UPDATED_DATE);
        body.source = 'IMS_INTEGRATION';
        body.role = userRole.id;
        body.user = currentUser.id;
        body.i_nip = PNALT;
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
        const body = new Privilege();
        body.updated_at = new Date();
        body.created_at = new Date(LAST_UPDATED_DATE);
        body.source = 'IMS_INTEGRATION';
        body.role = roleCurrent.id;
        body.user = currentUser.id;
        body.i_id = String(IDROLE);
        body.i_nip = PNALT;
        body.i_role = IDROLE;
        body.product = 1;

        console.log(body);

        await this.createPrivilage(body);
      }
    }

    const user = await this.accountRepository.findOne({
      where: {
        nip_new,
      },
      relations: ['department_details', 'job_details', 'roles'],
    });

    return {
      data: {
        user,
      },
    };
  }
}

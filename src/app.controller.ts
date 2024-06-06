import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentsParentService } from './department/department-parent.service';
import { DepartmentsService } from './department/department.service';
import { JobsService } from './job/job.service';
import { UserDepartmentService } from './users/users-department.service';
import { UserJobService } from './users/users-job.service';
import { UserPEOService } from './users/users-peo.service';
import { UsersService } from './users/users.service';
import { RolesService } from 'src/role/role.service';
import { PrivilegesService } from 'src/privilage/privilage.service';
import { UserPrivilegeService } from './users/users-privilege.service';
import { DepartmentsdetachedService } from './department/department-detached.service';

@ApiTags('Sink Sequence')
@Controller({
  path: 'sink-sequence',
})
export class AppController {
  constructor() // private readonly userPEOService: UserPEOService, // private readonly userJobService: UserJobService, // private readonly usersDepartmentService: UserDepartmentService, // private readonly usersService: UsersService,
  // private readonly departmentsService: DepartmentsService,
  // private readonly departmentsParentService: DepartmentsParentService,
  // private readonly jobsService: JobsService,
  // private readonly RolesService: RolesService,
  // private readonly PrivilegesService: PrivilegesService,
  // private readonly userPrivService: UserPrivilegeService,
  // private readonly departmentsdetachedService: DepartmentsdetachedService,
  {}

  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // async findAll() {
  //   /**
  //    * department master
  //    */
  //   await this.departmentsService.processDepartment();
  //   await this.departmentsParentService.processDepartmentParent();
  //   // await this.departmentsdetachedService.processDepartmentDetach();

  //   /**
  //    * job master
  //    */
  //   await this.jobsService.processJob();

  //   /**
  //    * role master
  //    */
  //   await this.RolesService.processRoles();

  //   /**
  //    * user
  //    */
  //   await this.usersService.getAccounts();
  //   await this.userPEOService.processAccountPeo();
  //   await this.usersDepartmentService.processAccountdepartment();
  //   await this.userJobService.processAccountjob();
  //   await this.userPrivService.processAccountRole();

  //   /**
  //    * privilege
  //    */
  //   await this.PrivilegesService.processPrivilege();
  //   await this.PrivilegesService.deleteOldPrivilega();

  //   return 'done';
  // }s
}

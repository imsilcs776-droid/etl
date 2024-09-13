import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DivisiService } from './sink-divisi/divisi.service';
import { PegawaiService } from './sink-pegawai/pegawai.service';
import { AtasanBawahanService } from './sink-atasan-bawahan/atasan-bawahan.service';
import { DepartmentsService } from './peo-department/department.service';
import { UsersService } from './peo-user/users.service';
import { ImsPrivilegeService } from './ims/ims-privilege.service';
import { UserDepartmentService } from './peo-user/users-department.service';
import { PrivilegesService } from './privilage/privilage.service';
import { PlhPeoService } from './sink-plh/plh-peo.service';
import { PlhService } from './sink-plh/plh.service';
import { RolesService } from './role/role.service';

@ApiTags('Sink Sequence')
@Controller({
  path: 'sink-sequence',
})
export class AppController {
  constructor(
    /**
     * sink peo
     */
    private readonly divisiService: DivisiService,
    private readonly pegawaiService: PegawaiService,
    private readonly atasanBawahanService: AtasanBawahanService,
    private readonly plhService: PlhService,

    /**
     * sink mv
     */
    private readonly departmentsService: DepartmentsService,
    private readonly usersService: UsersService,
    private readonly userDepartmentService: UserDepartmentService,

    /**
     * sink mv role portalsi
     */
    private readonly rolesService: RolesService,

    /**
     * default Privilege
     */
    private readonly PrivilegesServiceFromPortalsi: PrivilegesService,
    private readonly ImsPrivilegeService: ImsPrivilegeService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sinkAll() {
    await this.divisiService.processDivisi({});
    await this.pegawaiService.processPegawai({});
    await this.atasanBawahanService.processAtasanBawahan({});
    await this.plhService.processPlh({});

    /**
     * MV
     */

    /**
     * department master
     */
    await this.departmentsService.processDepartment();
    await this.departmentsService.processedUpdateParent();

    /**
     * user
     */
    await this.usersService.processUser();
    await this.userDepartmentService.processUserDepartment({});

    /**
     * role
     */
    await this.rolesService.processRoles();

    /**
     * privilege
     */
    await this.PrivilegesServiceFromPortalsi.processPrivilege({});
    await this.ImsPrivilegeService.processAccountRole();

    return;
  }

  @Post(':nipp_new')
  @HttpCode(HttpStatus.CREATED)
  async sinkById(@Param('nipp_new') nipp_new: string) {
    await this.divisiService.processDivisi({nipp_new});
    await this.pegawaiService.processPegawai({nipp_new});
    await this.atasanBawahanService.processAtasanBawahan({nipp_new});
    await this.plhService.processPlh({nipp_new});

    /**
     * MV
     */

    /**
     * department master
     */
    await this.departmentsService.processDepartment();
    await this.departmentsService.processedUpdateParent();

    /**
     * user
     */
    await this.usersService.processUser();
    await this.userDepartmentService.processUserDepartment({});

    /**
     * role
     */
    await this.rolesService.processRoles();

    /**
     * privilege
     */
    await this.PrivilegesServiceFromPortalsi.processPrivilege({});
    await this.ImsPrivilegeService.processAccountRole();

    return;
  }

  @Post('peo')
  @HttpCode(HttpStatus.CREATED)
  async sinkPeo() {
    await this.divisiService.processDivisi({});
    await this.pegawaiService.processPegawai({});
    await this.atasanBawahanService.processAtasanBawahan({});
    await this.plhService.processPlh({});

    return;
  }

  @Post('mv')
  @HttpCode(HttpStatus.CREATED)
  async sinkMv() {
    /**
     * department master
     */
    await this.departmentsService.processDepartment();
    await this.departmentsService.processedUpdateParent();

    /**
     * user
     */
    await this.usersService.processUser();
    await this.userDepartmentService.processUserDepartment({});

    /**
     * role
     */
    await this.rolesService.processRoles();

    /**
     * privilege
     */
    await this.PrivilegesServiceFromPortalsi.processPrivilege({});
    await this.ImsPrivilegeService.processAccountRole();

    return;
  }
}

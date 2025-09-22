import { Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DivisiService } from './sink-divisi/divisi.service';
import { PegawaiService } from './sink-pegawai/pegawai.service';
import { AtasanBawahanService } from './sink-atasan-bawahan/atasan-bawahan.service';
import { DepartmentsService } from './peo-department/department.service';
import { UsersService } from './peo-user/users.service';
import { ImsPrivilegeService } from './ims/ims-privilege.service';
import { UserDepartmentService } from './peo-user/users-department.service';
import { PrivilegesService } from './privilage/privilage.service';
import { PlhService } from './sink-plh/plh.service';
import { RolesService } from './role/role.service';
import { SyncLogsService } from './sync-log/sync-log.service';
import { errorResponse, successResponse } from './utils/response';

@ApiTags('Sink Sequence')
@Controller({
  path: 'sink-sequence',
})
export class AppController {
  constructor(
    private readonly syncLogService: SyncLogsService,
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
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sinkAll() {
    try {

      /**
       * start log
       */
      await this.syncLogService.startLog();

      /**
       * Peo
       */
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
      await this.usersService.processUser({});
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

      /**
       * End log
       */
      await this.syncLogService.endLog();

      return successResponse('sync sucessfully', {});
    } catch (e) {
      await this.syncLogService.endLog();
      throw new Error(e);
    }

  }

  @Post(':nipp_new')
  @HttpCode(HttpStatus.CREATED)
  async sinkById(@Param('nipp_new') nipp_new: string) {
    try {
      /**
        * start log
        */
      await this.syncLogService.startLog();

      /**
       * Peo
       */
      await this.divisiService.processDivisi({ nipp_new });
      const { isExist } = await this.pegawaiService.processPegawai({ nipp_new });

      if (!isExist) {
        throw new HttpException("Nipp new not found", HttpStatus.NOT_FOUND);
      }

      await this.atasanBawahanService.processAtasanBawahan({ nipp_new });
      await this.plhService.processPlh({ nipp_new });

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
      await this.usersService.processUser({ nipp_new });
      await this.userDepartmentService.processUserDepartment({ nippNew: nipp_new });

      /**
       * role
       */
      await this.rolesService.processRoles();

      /**
       * privilege
       */
      await this.PrivilegesServiceFromPortalsi.processPrivilege({ nipp_new });
      await this.ImsPrivilegeService.processAccountRole();

      /**
       * End log
       */
      await this.syncLogService.endLog();

      return successResponse('sync sucessfully', {});
    } catch (e) {
      await this.syncLogService.endLog();

      // If the error is already an HttpException, re-throw it
      if (e instanceof HttpException) {
        throw e;
      }

      // Otherwise, throw a generic 500 Internal Server Error
      throw new HttpException(e.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
    await this.usersService.processUser({});
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

    return successResponse('sync sucessfully', {});
  }

  @Get('status')
  @HttpCode(HttpStatus.OK)
  async status() {
    return this.syncLogService.isProcessing();
  }
}

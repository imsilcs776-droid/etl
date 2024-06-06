import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDepartmentService } from './users/users-department.service';
import { DivisiService } from './sink-divisi/divisi.service';
import { PegawaiService } from './sink-pegawai/pegawai.service';
import { AtasanBawahanService } from './sink-atasan-bawahan/atasan-bawahan.service';
import { DepartmentsService } from './peo-department/department.service';
import { UsersService } from './peo-user/users.service';
import { ImsPrivilegeService } from './ims/ims-privilege.service';

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

    /**
     * sink mv
     */
    private readonly departmentsService: DepartmentsService,
    private readonly usersService: UsersService,
    private readonly userDepartmentService: UserDepartmentService,

    /**
     * default Privilege
     */
    private readonly ImsPrivilegeService: ImsPrivilegeService,
  ) {}

  @Post('peo')
  @HttpCode(HttpStatus.CREATED)
  async sinkPeo() {
    await this.divisiService.processDivisi();
    await this.pegawaiService.processPegawai();
    await this.atasanBawahanService.processAtasanBawahan();

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
    await this.userDepartmentService.processAccountdepartment();

    /**
     * privilege
     */
    await this.ImsPrivilegeService.processAccountRole();

    return;
  }
}

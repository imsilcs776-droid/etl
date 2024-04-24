import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { DepartmentsService } from './department.service';
// import { CreateDepartmentDto } from './dto/create-Department.dto';
// import { UpdateDepartmentDto } from './dto/update-Department.dto';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentsParentService } from './department-parent.service';
import { DepartmentMDMService } from './department-mdm.service';
import { DepartmentsdetachedService } from './department-detached.service';

@ApiTags('Sync Department')
@Controller({
  path: 'sync-department',
})
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly departmentsParentService: DepartmentsParentService,
    private readonly departmentMDMService: DepartmentMDMService,
    private readonly departmentsdetachedService: DepartmentsdetachedService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.departmentsService.processDepartment();
  }

  @Post('parent')
  @HttpCode(HttpStatus.CREATED)
  async findDatacoreDepartmet() {
    return await this.departmentsParentService.processDepartmentParent();
  }

  @Delete('detached')
  @HttpCode(HttpStatus.OK)
  async detached() {
    return await this.departmentsdetachedService.processDepartmentDetach();
  }

  @Post('department/:objid')
  @HttpCode(HttpStatus.OK)
  async setDepartment(@Param('objid') objid?: string) {
    return await this.departmentsService.setDepartments({
      objid,
    });
  }

  @Get('mdm/departments')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('objid') objid?: string,
  ) {
    return await this.departmentMDMService.getDepartment({
      page,
      limit,
      objid,
    });
  }

  @Get('mdm/departments/:query')
  @HttpCode(HttpStatus.OK)
  async searchDepartment(
    @Param('query') query?: string
  ) {
    return await this.departmentMDMService.searchDepartment();
  }
}

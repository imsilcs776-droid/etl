import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserPrivilegeService } from './users-privilege.service';
import { UserDepartmentService } from './users-department.service';

@ApiTags('Sink MV')
@Controller({
  path: 'sync-account',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userPrivService: UserPrivilegeService,
    private readonly userDepService: UserDepartmentService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.usersService.processUser();
  }

  @Post('role')
  @HttpCode(HttpStatus.CREATED)
  async syngUserRole() {
    return await this.userPrivService.processAccountRole();
  }

  @Post('department')
  @HttpCode(HttpStatus.CREATED)
  @ApiQuery({
    name: 'nipp_new',
    type: String,
    description: 'A parameter. Optional',
    required: false,
  })
  async syngUserDepartment(@Query('nipp_new') nippNew: string) {
    return await this.userDepService.processUserDepartment({ nippNew });
  }
}

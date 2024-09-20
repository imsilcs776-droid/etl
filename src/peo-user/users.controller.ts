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
import { UsersMutationService } from './users-mutation.service';

@ApiTags('Sink MV')
@Controller({
  path: 'sync-account',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userPrivService: UserPrivilegeService,
    private readonly userDepService: UserDepartmentService,
    private readonly usersMutationService: UsersMutationService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.usersService.processUser({});
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

  @Get('users/:nipp_new/current')
  @HttpCode(HttpStatus.OK)
  async getUserCurrent(@Param('nipp_new') nipp_new: string) {
    return await this.usersMutationService.currentAccount(nipp_new);
  }

  @Put('users/:nipp_new/sync')
  @HttpCode(HttpStatus.CREATED)
  async getUserUpdate(@Param('nipp_new') nipp_new: string) {
    return await this.usersMutationService.syncCurrentAccount(nipp_new);
  }
}

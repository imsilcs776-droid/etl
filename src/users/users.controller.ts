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
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-user.dto';
import { UserDepartmentService } from './users-department.service';
import { UserMDMService } from './users-mdm.service';
import { UserJobService } from './users-job.service';
import { UserPEOService } from './users-peo.service';
import { UserPrivilegeService } from './users-privilege.service';
import { CreateAccountPeoDto } from './dto/create-user-peo.dto';
import { UserPEOSourceService } from './users-peo-source.service';
import { UsersMutationService } from './users-mutation.service';

@ApiTags('Sync Account')
@Controller({
  path: 'sync-account',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersDepartmentService: UserDepartmentService,
    private readonly userJobService: UserJobService,
    private readonly usersMDMService: UserMDMService,
    private readonly userPEOService: UserPEOService,
    private readonly userPrivService: UserPrivilegeService,
    private readonly userPEOSourceService: UserPEOSourceService,
    private readonly usersMutationService: UsersMutationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.usersService.getAccounts();
  }

  @Post('department')
  @HttpCode(HttpStatus.CREATED)
  async syngUserDepartment() {
    return await this.usersDepartmentService.processAccountdepartment();
  }

  @Post('job')
  @HttpCode(HttpStatus.CREATED)
  async syngUserJob() {
    return await this.userJobService.processAccountjob();
  }

  @Post('role')
  @HttpCode(HttpStatus.CREATED)
  async syngUserRole() {
    return await this.userPrivService.processAccountRole();
  }

  @Post('peo/akses')
  @HttpCode(HttpStatus.CREATED)
  async syngUserMdm(@Body() createAccountPeoDto: CreateAccountPeoDto) {
    return await this.userPEOSourceService.processAccountSourcePeo(
      createAccountPeoDto,
    );
  }

  @Post('id')
  @HttpCode(HttpStatus.CREATED)
  async syngUserId() {
    return await this.userPEOService.processAccountPeo();
  }

  @Post('test/create')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateAccountDto) {
    return await this.usersService.create(body);
  }

  @Get('users/mdm')
  @HttpCode(HttpStatus.OK)
  async getUser(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.usersMDMService.getAccount({ page, limit });
  }

  @Get('users/peo')
  @HttpCode(HttpStatus.OK)
  async getUserPeo(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.userPEOService.getAccountPEO({ page, limit });
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

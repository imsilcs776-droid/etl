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
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserPrivilegeService } from './users-privilege.service';

@ApiTags('Sync Account')
@Controller({
  path: 'sync-account',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userPrivService: UserPrivilegeService,
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
}

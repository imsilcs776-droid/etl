import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Query,
  Delete,
} from '@nestjs/common';
import { PrivilegesService } from './privilage.service';
import { ApiTags } from '@nestjs/swagger';
import { PrivilegesPEOService } from './privilage-peo.service';

@ApiTags('Sync Privilege')
@Controller({
  path: 'sync-privilege',
})
export class PrivilegesController {
  constructor(
    private readonly PrivilegesService: PrivilegesService,
    private readonly privilegesPEOService: PrivilegesPEOService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.PrivilegesService.processPrivilege();
  }

  @Delete('detached')
  @HttpCode(HttpStatus.OK)
  async detached() {
    return await this.PrivilegesService.deleteOldPrivilega();
  }

  @Get('peo/privileges')
  @HttpCode(HttpStatus.OK)
  async privileges(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.privilegesPEOService.getPrivileges({ page, limit });
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { RolesService } from './role.service';
import { ApiTags } from '@nestjs/swagger';
import { RolesPEOService } from './role-peo.service';

@ApiTags('Sink MV Portalsi')
@Controller({
  path: 'sync-role',
})
export class RolesController {
  constructor(
    private readonly RolesService: RolesService,
    private readonly rolesPEOService: RolesPEOService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.RolesService.processRoles();
  }

  @Get('portalsi/roles')
  @HttpCode(HttpStatus.OK)
  async getUser(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.rolesPEOService.getRoles({ page, limit });
  }
}

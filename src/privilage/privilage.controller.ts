import {
  Controller,
  Get,
  Post,
  HttpStatus,
  HttpCode,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { PrivilegesService } from './privilage.service';
import { ApiTags } from '@nestjs/swagger';
import { PrivilegesPortalsiService } from './privilage-portalsi.service';

@ApiTags('Sync Privilege')
@Controller({
  path: 'sync-privilege',
})
export class PrivilegesController {
  constructor(
    private readonly PrivilegesService: PrivilegesService,
    private readonly privilegesPortalsiService: PrivilegesPortalsiService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.PrivilegesService.processPrivilege({});
  }

  @Post(':nipp_new')
  @HttpCode(HttpStatus.CREATED)
  async byNipp(@Param('nipp_new') nipp_new: string) {
    return await this.PrivilegesService.processPrivilege({ nipp_new });
  }

  @Delete('detached')
  @HttpCode(HttpStatus.OK)
  async detached() {
    return await this.PrivilegesService.deleteOldPrivilega();
  }

  @Get('peo/privileges')
  @HttpCode(HttpStatus.OK)
  async privileges(@Query('page') page: number, @Query('limit') limit: number) {
    return await this.privilegesPortalsiService.getPrivileges({ page, limit });
  }
}

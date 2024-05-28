import { Controller, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImsPrivilegeService } from './ims-privilege.service';

@ApiTags('Sink MV')
@Controller({
  path: 'sync-role',
})
export class ImsController {
  constructor(private readonly imsPrivService: ImsPrivilegeService) {}

  @Post('default')
  @HttpCode(HttpStatus.CREATED)
  async syngUserRole() {
    return await this.imsPrivService.processAccountRole();
  }
}

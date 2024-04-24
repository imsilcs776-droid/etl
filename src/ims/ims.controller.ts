import { Controller, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ImsPrivilegeService } from './ims-privilege.service';

@ApiTags('Ims')
@Controller({
  path: 'sync-ims',
})
export class ImsController {
  constructor(private readonly imsPrivService: ImsPrivilegeService) {}

  @Post('deafault-privilege')
  @HttpCode(HttpStatus.CREATED)
  async syngUserRole() {
    return await this.imsPrivService.processAccountRole();
  }
}

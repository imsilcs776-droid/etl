import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompanyMvService } from './mv-company.service';

@ApiTags('MV')
@Controller({
  path: 'mv-company',
})
export class CompanyMvController {
  constructor(private readonly departmentService: CompanyMvService) {}

  @Get()
  @HttpCode(HttpStatus.ACCEPTED)
  async findAll() {
    return await this.departmentService.getMvCompany();
  }
}

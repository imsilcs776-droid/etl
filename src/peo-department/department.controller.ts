import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentsService } from './department.service';

@ApiTags('Peo Department')
@Controller({
  path: 'sync-department',
})
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.departmentService.processDepartment();
  }
}

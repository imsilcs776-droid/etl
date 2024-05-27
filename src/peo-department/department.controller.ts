import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DepartmentsService } from './department.service';

@ApiTags('Sink MV')
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

  @Post('parent')
  @HttpCode(HttpStatus.CREATED)
  async findAllParent() {
    return await this.departmentService.processedUpdateParent();
  }
}

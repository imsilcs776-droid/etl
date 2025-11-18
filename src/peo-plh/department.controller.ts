import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlhUserDepartmentsService } from './department.service';

@ApiTags('Sink MV')
@Controller({
  path: 'sync-plh-user-department',
})
export class PlhUserDepartmentsController {
  constructor(private readonly departmentService: PlhUserDepartmentsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.departmentService.processPlhUserDepartment();
  }
}

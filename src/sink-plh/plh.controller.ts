import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Query,
  Param,
  Delete,
} from '@nestjs/common';
import { PlhService } from './plh.service';
import { ApiTags } from '@nestjs/swagger';
import { PlhPeoService } from './plh-peo.service';

@ApiTags('Sink Peo')
@Controller({
  path: 'sink-plh',
})
export class PlhController {
  constructor(
    private readonly plhService: PlhService,
    private readonly plhPeoService: PlhPeoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.plhService.processPlh();
  }

  @Get('peo/plh')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('objid') objid?: string,
  ) {
    return await this.plhPeoService.getPlh({
      page,
      limit,
      objid,
    });
  }
}

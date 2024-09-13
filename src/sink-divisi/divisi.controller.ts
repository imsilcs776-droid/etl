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
import { DivisiService } from './divisi.service';
// import { CreateDivisiDto } from './dto/create-Divisi.dto';
// import { UpdateDivisiDto } from './dto/update-Divisi.dto';
import { ApiTags } from '@nestjs/swagger';
import { DivisiPeoService } from './divisi-peo.service';

@ApiTags('Sink Peo')
@Controller({
  path: 'sink-divisi',
})
export class DivisiController {
  constructor(
    private readonly divisiService: DivisiService,
    private readonly divisiPeoService: DivisiPeoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.divisiService.processDivisi({});
  }

  @Get('peo/divisi')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('objid') objid?: string,
  ) {
    return await this.divisiPeoService.getDivisi({
      page,
      limit,
      objid,
    });
  }
}

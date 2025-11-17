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
import { DivisiByPLHService } from './divisi.service';
// import { CreateDivisiDto } from './dto/create-Divisi.dto';
// import { UpdateDivisiDto } from './dto/update-Divisi.dto';
import { ApiTags } from '@nestjs/swagger';
import { DivisiByPLHPeoService } from './divisi-peo.service';

@ApiTags('Sink Peo')
@Controller({
  path: 'sink-divisi-by-plh',
})
export class DivisiByPLHController {
  constructor(
    private readonly divisiService: DivisiByPLHService,
    private readonly divisiPeoService: DivisiByPLHPeoService,
  ) { }

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

  @Get('peo/divisi/:nipp_new')
  @HttpCode(HttpStatus.OK)
  async getDivByNippNew(
    @Param('nipp_new') nipp_new?: string,
  ) {
    return await this.divisiPeoService.getDivisi({
      nipp_new,
    });
  }
}

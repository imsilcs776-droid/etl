import {
  Controller,
  Get,
  Post,
  HttpStatus,
  HttpCode,
  Query,
  Param,
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
    return await this.divisiPeoService.getDivisiWithPlh({
      page,
      limit,
      objid,
    });
  }

  @Get('peo/divisi/:nipp_new')
  @HttpCode(HttpStatus.OK)
  async getDivByNippNew(@Param('nipp_new') nipp_new?: string) {
    return await this.divisiPeoService.getDivisiWithPlh({
      nipp_new,
    });
  }
}

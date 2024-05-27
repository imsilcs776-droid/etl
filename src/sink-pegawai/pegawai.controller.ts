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
import { PegawaiService } from './pegawai.service';
// import { CreatePegawaiDto } from './dto/create-Pegawai.dto';
// import { UpdatePegawaiDto } from './dto/update-Pegawai.dto';
import { ApiTags } from '@nestjs/swagger';
import { PegawaiPeoService } from './pegawai-peo.service';

@ApiTags('Sink Peo')
@Controller({
  path: 'sink-pegawai',
})
export class PegawaiController {
  constructor(
    private readonly pegawaiService: PegawaiService,
    private readonly pegawaiPeoService: PegawaiPeoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.pegawaiService.processPegawai();
  }

  @Get('peo/pegawai')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('objid') objid?: string,
  ) {
    return await this.pegawaiPeoService.getPegawai({
      page,
      limit,
      objid,
    });
  }
}

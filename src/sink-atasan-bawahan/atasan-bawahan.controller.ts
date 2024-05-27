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
import { AtasanBawahanService } from './atasan-bawahan.service';
// import { CreateAtasanBawahanDto } from './dto/create-AtasanBawahan.dto';
// import { UpdateAtasanBawahanDto } from './dto/update-AtasanBawahan.dto';
import { ApiTags } from '@nestjs/swagger';
import { AtasanBawahanPeoService } from './atasan-bawahan-peo.service';

@ApiTags('Sink Atasan Bawahan Peo')
@Controller({
  path: 'sink-atasan-bawahan',
})
export class AtasanBawahanController {
  constructor(
    private readonly atasanBawahanService: AtasanBawahanService,
    private readonly atasanBawahanPeoService: AtasanBawahanPeoService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async findAll() {
    return await this.atasanBawahanService.processAtasanBawahan();
  }

  @Get('peo/atasanBawahan')
  @HttpCode(HttpStatus.OK)
  async getUser(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('objid') objid?: string,
  ) {
    return await this.atasanBawahanPeoService.getAtasanBawahan({
      page,
      limit,
      objid,
    });
  }
}

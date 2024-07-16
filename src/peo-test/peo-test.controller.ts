import { Controller, Get, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { PeoTestService } from './peo-test.service';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Peo Test')
@Controller({ path: 'peo-test' })
export class PeoTestController {
  constructor(public psoDivisiService: PeoTestService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'query',
    type: String,
    description: 'Put your query',
    required: true,
  })
  async findByQuery(@Query('query') query: string): Promise<any> {
    try {
      const a = await this.psoDivisiService.findByQuery(query);
      return a;
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('divisi')
  @HttpCode(HttpStatus.OK)
  async findDivisi(): Promise<any> {
    try {
      return await this.psoDivisiService.findDivisi();
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('atasan-bawahan')
  @HttpCode(HttpStatus.OK)
  async findAtasanBawahan(): Promise<any> {
    try {
      return await this.psoDivisiService.findAtasanBawahan();
    } catch (e) {
      throw new Error(e);
    }
  }

  @Get('pegawai')
  @HttpCode(HttpStatus.OK)
  async findRolePegawai(): Promise<any> {
    try {
      return await this.psoDivisiService.findRolePegawai();
    } catch (e) {
      throw new Error(e);
    }
  }
}

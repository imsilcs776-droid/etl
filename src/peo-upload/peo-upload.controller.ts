import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PeoUploadService } from './peo-upload.service';

@ApiTags('Peo Upload')
@Controller({ path: 'peo-upload' })
export class PeoUploadController {
  constructor(private readonly peoUploadService: PeoUploadService) {}

  @Post('divisi')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadDivisi(@UploadedFile() file) {
    return await this.peoUploadService.processDivisi(file);
  }

  @Post('pegawai')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadPegawai(@UploadedFile() file) {
    return await this.peoUploadService.processPegawai(file);
  }

  @Post('atasan-bawahan')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAtasanBawahan(@UploadedFile() file) {
    return await this.peoUploadService.processAtasanBawahan(file);
  }
}

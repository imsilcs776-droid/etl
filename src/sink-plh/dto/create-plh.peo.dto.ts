// your-entity.dto.ts

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreatePlhPeoDto {
  @ApiHideProperty()
  ID: number;

  @ApiProperty()
  NIPP_PEJABAT: string;

  @ApiProperty()
  NAMA_PEJABAT: string;

  @ApiProperty()
  JABATAN_PEJABAT: string;

  @ApiProperty()
  NIPP_PLH: string;

  @ApiProperty()
  NAMA_PLH: string;

  @ApiProperty()
  JABATAN_PLH: string;

  @ApiProperty()
  LAMPIRAN: string;

  @ApiProperty()
  STATUS: number;

  @ApiProperty()
  CREATED_BY: string;

  @ApiProperty()
  CREATED_AT: Date;

  @ApiProperty({ required: false })
  UPDATED_BY: string;

  @ApiProperty({ required: false })
  UPDATED_AT: Date;

  @ApiProperty()
  CREATED_NAME: string;

  @ApiProperty({ required: false })
  UPDATED_NAME: string;

  @ApiProperty()
  MULAI: Date;

  @ApiProperty()
  AKHIR: Date;

  @ApiProperty()
  TIPE: string;

  @ApiProperty()
  KD_PEL_PEJABAT: string;

  @ApiProperty()
  KD_PEL_PLH: string;

  @ApiProperty({ required: false })
  KD_DIV: string;

  @ApiProperty({ required: false })
  KD_WIL: string;

  @ApiProperty({ required: false })
  KD_DIV_PLH: string;

  @ApiProperty({ required: false })
  KD_WIL_PLH: string;

  @ApiProperty({ required: false })
  NAJAB_BA: string;

  @ApiProperty({ required: false })
  PERSG: string;

  @ApiProperty({ required: false })
  JENIS: string;

  @ApiProperty({ required: false })
  IP: string;

  @ApiProperty({ required: false })
  KODE_NOMOR: string;

  @ApiProperty({ required: false })
  KODE_DIREKTORAT: string;

  @ApiProperty({ required: false })
  NAMA_DIREKTORAT: string;

  @ApiProperty({ required: false })
  KELOMPOK: string;

  @ApiProperty({ required: false })
  NIPP_PLH_BARU: string;

  @ApiProperty({ required: false })
  NIPP_PEJABAT_BARU: string;

  @ApiProperty({ required: false })
  NAMA_SUB_AREA: string;

  @ApiProperty({ required: false })
  CABANG_NAME: string;

  @ApiProperty({ required: false })
  NAJAB_SUBAREA: string;

  @ApiProperty({ required: false })
  INSTANSI: string;

  @ApiProperty()
  KD_JABATAN: string;

  @ApiProperty({ required: false })
  JENIS_SK: string;

  @ApiProperty({ required: false })
  DOC_NO: string;
}

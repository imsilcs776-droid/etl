// your-entity.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class CreatePlhPeoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  i_id: number;

  @ApiProperty()
  nipp_pejabat: string;

  @ApiProperty()
  nama_pejabat: string;

  @ApiProperty()
  jabatan_pejabat: string;

  @ApiProperty()
  nipp_plh: string;

  @ApiProperty()
  nama_plh: string;

  @ApiProperty()
  jabatan_plh: string;

  @ApiProperty()
  lampiran: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  created_by: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ required: false })
  updated_by: string;

  @ApiProperty({ required: false })
  updated_at: Date;

  @ApiProperty()
  created_name: string;

  @ApiProperty({ required: false })
  updated_name: string;

  @ApiProperty()
  mulai: Date;

  @ApiProperty()
  akhir: Date;

  @ApiProperty()
  tipe: string;

  @ApiProperty()
  kd_pel_pejabat: string;

  @ApiProperty()
  kd_pel_plh: string;

  @ApiProperty({ required: false })
  kd_div: string;

  @ApiProperty({ required: false })
  kd_wil: string;

  @ApiProperty({ required: false })
  kd_div_plh: string;

  @ApiProperty({ required: false })
  kd_wil_plh: string;

  @ApiProperty({ required: false })
  najab_ba: string;

  @ApiProperty({ required: false })
  persg: string;

  @ApiProperty({ required: false })
  jenis: string;

  @ApiProperty({ required: false })
  ip: string;

  @ApiProperty({ required: false })
  kode_nomor: string;

  @ApiProperty({ required: false })
  kode_direktorat: string;

  @ApiProperty({ required: false })
  nama_direktorat: string;

  @ApiProperty({ required: false })
  kelompok: string;

  @ApiProperty({ required: false })
  nipp_plh_baru: string;

  @ApiProperty({ required: false })
  nipp_pejabat_baru: string;

  @ApiProperty({ required: false })
  nama_sub_area: string;

  @ApiProperty({ required: false })
  cabang_name: string;

  @ApiProperty({ required: false })
  najab_subarea: string;

  @ApiProperty({ required: false })
  instansi: string;

  @ApiProperty()
  kd_jabatan: string;

  @ApiProperty({ required: false })
  jenis_sk: string;

  @ApiProperty({ required: false })
  doc_no: string;

  @ApiProperty({ required: false })
  user_plh_id: string;

  @ApiProperty({ required: false })
  dept_pejabat_id: number;
}

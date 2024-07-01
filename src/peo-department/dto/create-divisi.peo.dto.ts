// your-entity.dto.ts

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class CreateDivisiPeoDto {
  @ApiHideProperty()
  id: string;
  @ApiProperty()
  kd_div_arsip: string;

  @ApiProperty()
  kd_induk: string;

  @ApiProperty()
  nama_dir: string;

  @ApiProperty()
  kd_wil_arsip: string;

  @ApiProperty()
  nama_cabang: string;

  @ApiProperty()
  updated: string;

  @ApiProperty()
  kd_sub: string;

  @ApiProperty()
  nip_pejabat: string;

  @ApiProperty()
  nama_pejabat: string;

  @ApiProperty()
  email_pejabat: string;

  @ApiProperty()
  parent: string;

  @ApiProperty()
  label_parent: string;

  @ApiProperty()
  id_old: string;

  @ApiProperty()
  kd_sek: string;

  @ApiProperty()
  kode_nomor: string;

  @ApiProperty()
  kode_direktorat: string;

  @ApiProperty() // Custom name for Swagger documentation
  nama_direktorat: string;

  @ApiProperty()
  kelompok: string;

  @ApiProperty()
  akses_surat: string;

  @ApiProperty()
  ttd: string;

  @ApiProperty()
  grup: string;

  @ApiProperty()
  pengolah: string;

  @ApiProperty()
  kd_subsi: string;

  @ApiProperty()
  instansi: string;

  @ApiProperty()
  kd_jabatan: string;

  @ApiProperty()
  pejabat: string;

  @ApiProperty()
  jenis: string;

  @ApiProperty()
  nama_sub_travel: string;

  @ApiProperty()
  created_by: string;

  @ApiProperty()
  is_deleted: string;

  @ApiProperty()
  created: string;

  @ApiProperty()
  created_name: string;

  @ApiProperty()
  updated_by: string;

  @ApiProperty()
  updated_name: string;

  @ApiProperty()
  div_wil: string;

  @ApiProperty()
  werks_new: string;
}

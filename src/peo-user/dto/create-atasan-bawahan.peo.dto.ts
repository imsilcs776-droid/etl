import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class EmployeeDTO {
  @ApiHideProperty()
  id: string;
  @ApiProperty()
  nipp: string;

  @ApiProperty()
  nipp_ats: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  nama_jabatan: string;

  @ApiProperty()
  kd_cabang_sap: string;

  @ApiProperty()
  sub_area: string;

  @ApiProperty()
  kd_pel: string;

  @ApiProperty()
  nama_ats: string;

  @ApiProperty()
  nama_jabatan_ats: string;

  @ApiProperty()
  kd_cabang_sap_ats: string;

  @ApiProperty()
  sub_area_ats: string;

  @ApiProperty()
  kd_pel_ats: string;

  @ApiProperty()
  Ivl: string;

  @ApiProperty()
  company_code: string;

  @ApiProperty()
  company_code_ats: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  email_ats: string;

  @ApiProperty()
  pembuat_lvl: string;

  @ApiProperty()
  kode_wil: string;

  @ApiProperty()
  kd_div: string;

  @ApiProperty()
  kd_wil_ats: string;

  @ApiProperty()
  kd_div_ats: string;

  @ApiProperty()
  short: string;

  @ApiProperty()
  subdi: string;

  @ApiProperty()
  short_ats: string;

  @ApiProperty()
  subdi_ats: string;

  @ApiProperty()
  nipp_baru: string;

  @ApiProperty()
  nipp_ats_baru: string;

  @ApiProperty()
  instansi: string;

  @ApiProperty()
  instansi_ats: string;

  @ApiProperty()
  pegawai: string;
}

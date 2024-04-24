import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class EmployeeDTO {
  @ApiHideProperty()
  id: string;

  @ApiProperty()
  kode_sap: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  nipp: string;

  @ApiProperty()
  kd_cabang_sap: string;

  @ApiProperty()
  nama_cabang: string;

  @ApiProperty()
  kd_jabatan: string;

  @ApiProperty()
  nama_jabatan: string;

  @ApiProperty()
  kelas_jabatan: string;

  @ApiProperty()
  kd_dir: string;

  @ApiProperty()
  nama_dir: string;

  @ApiProperty()
  kd_sub: string;

  @ApiProperty()
  nama_sub: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  hp: string;

  @ApiProperty()
  account_ad: string;

  @ApiProperty()
  kd_wil_arsip: string;

  @ApiProperty()
  kd_div_arsip: string;

  @ApiProperty()
  cookie: string;

  @ApiProperty()
  persg: string;

  @ApiProperty()
  kd_pel: string;

  @ApiProperty()
  sub_area: string;

  @ApiProperty()
  nama_subarea: string;

  @ApiProperty()
  jenis: string;

  @ApiProperty()
  notif: string;

  @ApiProperty()
  jenis_sk: string;

  @ApiProperty()
  nama_jabatan_sk: string;

  @ApiProperty()
  trfso: string;

  @ApiProperty()
  tmt_periodik: string;

  @ApiProperty()
  tunjangan: string;

  @ApiProperty()
  talhir: string;

  @ApiProperty()
  pathir: string;

  @ApiProperty()
  stext: string;

  @ApiProperty()
  ttl: string;

  @ApiProperty()
  kode_nomor: string;

  @ApiProperty()
  kode_direktorat: string;

  @ApiProperty()
  akses_surat: string;

  @ApiProperty()
  nama_direktorat: string;

  @ApiProperty()
  kelompok: string;

  @ApiProperty()
  nipp_baru: string;

  @ApiProperty()
  ttd: string;

  @ApiProperty()
  cabang_name: string;

  @ApiProperty()
  group: string;

  @ApiProperty()
  pengolah: string;

  @ApiProperty()
  bisa_hapus: string;

  @ApiProperty()
  company_code: string;

  @ApiProperty()
  instansi: string;

  @ApiProperty()
  last_updated_date: string;

  @ApiProperty()
  cost_center: string;

  @ApiProperty()
  bank_key: string;

  @ApiProperty()
  bank_name: string;

  @ApiProperty()
  bank_account: string;

  @ApiProperty()
  werks_new: string;

  @ApiProperty()
  pbtxt_new: string;

  @ApiProperty()
  btrl_new: string;

  @ApiProperty()
  btrx_new: string;

  @ApiProperty()
  created_date: string;

  @ApiProperty()
  travelcostcenter: string;

  @ApiProperty()
  nama_sub_travel: string;

  @ApiProperty()
  id_old: string;

  @ApiProperty()
  costcenter_sto: string;

  @ApiProperty()
  chiefposition: string;

  @ApiProperty()
  persasto: string;

  @ApiProperty()
  subpersa_sto: string;

  @ApiProperty()
  persatext_sto: string;

  @ApiProperty()
  subpersatext_sto: string;

  @ApiProperty()
  payscaletype: string;

  @ApiProperty()
  payscaletypetext: string;

  @ApiProperty()
  pegawai: string;
}

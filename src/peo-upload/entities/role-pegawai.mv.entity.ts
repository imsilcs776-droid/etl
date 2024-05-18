import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('peo_role', {
  synchronize: true,
})
export class RolePegawaiMvEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  kode_sap: string;

  @Column({ nullable: true })
  nama: string;

  @Column({ nullable: true })
  nipp: string;

  @Column({ nullable: true })
  kd_cabang_sap: string;

  @Column({ nullable: true })
  nama_cabang: string;

  @Column({ nullable: true })
  kd_jabatan: string;

  @Column({ nullable: true })
  nama_jabatan: string;

  @Column({ nullable: true })
  kelas_jabatan: string;

  @Column({ nullable: true })
  kd_dir: string;

  @Column({ nullable: true })
  nama_dir: string;

  @Column({ nullable: true })
  kd_sub: string;

  @Column({ nullable: true })
  nama_sub: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  hp: string;

  @Column({ nullable: true })
  account_ad: string;

  @Column({ nullable: true })
  kd_wil_arsip: string;

  @Column({ nullable: true })
  kd_div_arsip: string;

  @Column({ nullable: true })
  cookie: string;

  @Column({ nullable: true })
  persg: string;

  @Column({ nullable: true })
  kd_pel: string;

  @Column({ nullable: true })
  sub_area: string;

  @Column({ nullable: true })
  nama_subarea: string;

  @Column({ nullable: true })
  jenis: string;

  @Column({ nullable: true })
  notif: string;

  @Column({ nullable: true })
  jenis_sk: string;

  @Column({ nullable: true })
  nama_jabatan_sk: string;

  @Column({ nullable: true })
  trfso: string;

  @Column({ nullable: true })
  tmt_periodik: string;

  @Column({ nullable: true })
  tunjangan: string;

  @Column({ nullable: true })
  talhir: string;

  @Column({ nullable: true })
  pathir: string;

  @Column({ nullable: true })
  stext: string;

  @Column({ nullable: true })
  ttl: string;

  @Column({ nullable: true })
  kode_nomor: string;

  @Column({ nullable: true })
  kode_direktorat: string;

  @Column({ nullable: true })
  akses_surat: string;

  @Column({ nullable: true }) // Column name in database
  nama_direktorat: string;

  @Column({ nullable: true })
  kelompok: string;

  @Column({ nullable: true })
  nipp_baru: string;

  @Column({ nullable: true })
  ttd: string;

  @Column({ nullable: true })
  cabang_name: string;

  @Column({ nullable: true })
  group: string;

  @Column({ nullable: true })
  pengolah: string;

  @Column({ nullable: true })
  bisa_hapus: string;

  @Column({ nullable: true })
  company_code: string;

  @Column({ nullable: true })
  instansi: string;

  @Column({ nullable: true })
  last_updated_date: string;

  @Column({ nullable: true })
  cost_center: string;

  @Column({ nullable: true })
  bank_key: string;

  @Column({ nullable: true })
  bank_name: string;

  @Column({ nullable: true })
  bank_account: string;

  @Column({ nullable: true })
  werks_new: string;

  @Column({ nullable: true })
  pbtxt_new: string;

  @Column({ nullable: true })
  btrl_new: string;

  @Column({ nullable: true })
  btrx_new: string;

  @Column({ nullable: true })
  created_date: string;

  @Column({ nullable: true })
  travelcostcenter: string;

  @Column({ nullable: true })
  nama_sub_travel: string;

  @Column({ nullable: true })
  id_old: string;

  @Column({ nullable: true })
  costcenter_sto: string;

  @Column({ nullable: true })
  chiefposition: string;

  @Column({ nullable: true })
  persasto: string;

  @Column({ nullable: true })
  subpersa_sto: string;

  @Column({ nullable: true })
  persatext_sto: string;

  @Column({ nullable: true })
  subpersatext_sto: string;

  @Column({ nullable: true })
  payscaletype: string;

  @Column({ nullable: true })
  payscaletypetext: string;

  @Column({ nullable: true })
  pegawai: string;
}
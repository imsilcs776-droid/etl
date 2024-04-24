// your-entity.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('peo_atasan_bawahan', {
  synchronize: true,
})
export class AtasanBawahanPeoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  nipp: string;

  @Column({ nullable: true })
  nipp_ats: string;

  @Column({ nullable: true })
  nama: string;

  @Column({ nullable: true })
  nama_jabatan: string;

  @Column({ nullable: true })
  kd_cabang_sap: string;

  @Column({ nullable: true })
  sub_area: string;

  @Column({ nullable: true })
  kd_pel: string;

  @Column({ nullable: true })
  nama_ats: string;

  @Column({ nullable: true })
  nama_jabatan_ats: string;

  @Column({ nullable: true })
  kd_cabang_sap_ats: string;

  @Column({ nullable: true })
  sub_area_ats: string;

  @Column({ nullable: true })
  kd_pel_ats: string;

  @Column({ nullable: true })
  Ivl: string;

  @Column({ nullable: true })
  company_code: string;

  @Column({ nullable: true })
  company_code_ats: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  email_ats: string;

  @Column({ nullable: true })
  pembuat_lvl: string;

  @Column({ nullable: true })
  kode_wil: string;

  @Column({ nullable: true })
  kd_div: string;

  @Column({ nullable: true })
  kd_wil_ats: string;

  @Column({ nullable: true })
  kd_div_ats: string;

  @Column({ nullable: true })
  short: string;

  @Column({ nullable: true })
  subdi: string;

  @Column({ nullable: true })
  short_ats: string;

  @Column({ nullable: true })
  subdi_ats: string;

  @Column({ nullable: true })
  nipp_baru: string;

  @Column({ nullable: true })
  nipp_ats_baru: string;

  @Column({ nullable: true })
  instansi: string;

  @Column({ nullable: true })
  instansi_ats: string;

  @Column({ nullable: true })
  pegawai: string;
}

// your-entity.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('peo_divisi', {
  synchronize: true,
})
export class DivisiPeoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true }) // Allow kd_div_arsip to be nullable
  kd_div_arsip: string;

  @Column({ nullable: true }) // Allow kd_induk to be nullable
  kd_induk: string;

  @Column({ nullable: true }) // Allow nama_dir to be nullable
  nama_dir: string;

  @Column({ nullable: true }) // Allow kd_wil_arsip to be nullable
  kd_wil_arsip: string;

  @Column({ nullable: true }) // Allow nama_cabang to be nullable
  nama_cabang: string;

  @Column({ nullable: true }) // Allow updated to be nullable
  updated: string;

  @Column({ nullable: true }) // Allow kd_sub to be nullable
  kd_sub: string;

  @Column({ nullable: true }) // Allow nip_pejabat to be nullable
  nip_pejabat: string;

  @Column({ nullable: true }) // Allow nama_pejabat to be nullable
  nama_pejabat: string;

  @Column({ nullable: true }) // Allow email_pejabat to be nullable
  email_pejabat: string;

  @Column({ nullable: true }) // Allow parent to be nullable
  parent: string;

  @Column({ nullable: true }) // Allow label_parent to be nullable
  label_parent: string;

  @Column({ nullable: true }) // Allow id_old to be nullable
  id_old: string;

  @Column({ nullable: true }) // Allow kd_sek to be nullable
  kd_sek: string;

  @Column({ nullable: true }) // Allow kode_nomor to be nullable
  kode_nomor: string;

  @Column({ nullable: true }) // Allow kode_direktorat to be nullable
  kode_direktorat: string;

  @Column({ nullable: true }) // Allow nama_direktorat to be nullable
  nama_direktorat: string;

  @Column({ nullable: true }) // Allow kelompok to be nullable
  kelompok: string;

  @Column({ nullable: true }) // Allow akses_surat to be nullable
  akses_surat: string;

  @Column({ nullable: true }) // Allow ttd to be nullable
  ttd: string;

  @Column({ nullable: true }) // Allow group to be nullable
  group: string;

  @Column({ nullable: true }) // Allow pengolah to be nullable
  pengolah: string;

  @Column({ nullable: true }) // Allow kd_subsi to be nullable
  kd_subsi: string;

  @Column({ nullable: true }) // Allow instansi to be nullable
  instansi: string;

  @Column({ nullable: true }) // Allow kd_jabatan to be nullable
  kd_jabatan: string;

  @Column({ nullable: true }) // Allow pejabat to be nullable
  pejabat: string;

  @Column({ nullable: true }) // Allow jenis to be nullable
  jenis: string;

  @Column({ nullable: true }) // Allow nama_sub_travel to be nullable
  nama_sub_travel: string;

  @Column({ nullable: true }) // Allow created_by to be nullable
  created_by: string;

  @Column({ nullable: true }) // Allow is_deleted to be nullable
  is_deleted: string;

  @Column({ nullable: true }) // Allow created to be nullable
  created: string;

  @Column({ nullable: true }) // Allow created_name to be nullable
  created_name: string;

  @Column({ nullable: true }) // Allow updated_by to be nullable
  updated_by: string;

  @Column({ nullable: true }) // Allow updated_name to be nullable
  updated_name: string;
}

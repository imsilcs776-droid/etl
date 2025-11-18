// your-entity.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('peo_plh', {
  synchronize: true,
})
export class PlhPeoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  i_id: number;

  @Column()
  nipp_pejabat: string;

  @Column()
  nama_pejabat: string;

  @Column()
  jabatan_pejabat: string;

  @Column()
  nipp_plh: string;

  @Column()
  nama_plh: string;

  @Column()
  jabatan_plh: string;

  @Column()
  lampiran: string;

  @Column()
  status: number;

  @Column()
  created_by: string;

  @Column()
  created_at: Date;

  @Column({ nullable: true })
  updated_by: string;

  @Column()
  updated_at: Date;

  @Column()
  created_name: string;

  @Column({ nullable: true })
  updated_name: string;

  @Column()
  mulai: Date;

  @Column()
  akhir: Date;

  @Column()
  tipe: string;

  @Column()
  kd_pel_pejabat: string;

  @Column()
  kd_pel_plh: string;

  @Column({ nullable: true })
  kd_div: string;

  @Column({ nullable: true })
  kd_wil: string;

  @Column({ nullable: true })
  kd_div_plh: string;

  @Column({ nullable: true })
  kd_wil_plh: string;

  @Column({ nullable: true })
  najab_ba: string;

  @Column({ nullable: true })
  persg: string;

  @Column({ nullable: true })
  jenis: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  kode_nomor: string;

  @Column({ nullable: true })
  kode_direktorat: string;

  @Column({ nullable: true })
  nama_direktorat: string;

  @Column({ nullable: true })
  kelompok: string;

  @Column({ nullable: true })
  nipp_plh_baru: string;

  @Column({ nullable: true })
  nipp_pejabat_baru: string;

  @Column({ nullable: true })
  nama_sub_area: string;

  @Column({ nullable: true })
  cabang_name: string;

  @Column({ nullable: true })
  najab_subarea: string;

  @Column({ nullable: true })
  instansi: string;

  @Column()
  kd_jabatan: string;

  @Column({ nullable: true })
  jenis_sk: string;

  @Column({ nullable: true })
  doc_no: string;

  @Column({ nullable: true })
  user_plh_id: string;

  @Column({ nullable: true })
  dept_pejabat_id: number;
}

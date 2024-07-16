// your-entity.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('master_plh', {
  synchronize: true,
})
export class PlhPeoEntity {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  NIPP_PEJABAT: string;

  @Column()
  NAMA_PEJABAT: string;

  @Column()
  JABATAN_PEJABAT: string;

  @Column()
  NIPP_PLH: string;

  @Column()
  NAMA_PLH: string;

  @Column()
  JABATAN_PLH: string;

  @Column()
  LAMPIRAN: string;

  @Column()
  STATUS: number;

  @Column()
  CREATED_BY: string;

  @Column({ type: 'timestamp' })
  CREATED_AT: Date;

  @Column({ nullable: true })
  UPDATED_BY: string;

  @Column({ type: 'timestamp', nullable: true })
  UPDATED_AT: Date;

  @Column()
  CREATED_NAME: string;

  @Column({ nullable: true })
  UPDATED_NAME: string;

  @Column({ type: 'timestamp' })
  MULAI: Date;

  @Column({ type: 'timestamp' })
  AKHIR: Date;

  @Column()
  TIPE: string;

  @Column()
  KD_PEL_PEJABAT: string;

  @Column()
  KD_PEL_PLH: string;

  @Column({ nullable: true })
  KD_DIV: string;

  @Column({ nullable: true })
  KD_WIL: string;

  @Column({ nullable: true })
  KD_DIV_PLH: string;

  @Column({ nullable: true })
  KD_WIL_PLH: string;

  @Column({ nullable: true })
  NAJAB_BA: string;

  @Column({ nullable: true })
  PERSG: string;

  @Column({ nullable: true })
  JENIS: string;

  @Column({ nullable: true })
  IP: string;

  @Column({ nullable: true })
  KODE_NOMOR: string;

  @Column({ nullable: true })
  KODE_DIREKTORAT: string;

  @Column({ nullable: true })
  NAMA_DIREKTORAT: string;

  @Column({ nullable: true })
  KELOMPOK: string;

  @Column({ nullable: true })
  NIPP_PLH_BARU: string;

  @Column({ nullable: true })
  NIPP_PEJABAT_BARU: string;

  @Column({ nullable: true })
  NAMA_SUB_AREA: string;

  @Column({ nullable: true })
  CABANG_NAME: string;

  @Column({ nullable: true })
  NAJAB_SUBAREA: string;

  @Column({ nullable: true })
  INSTANSI: string;

  @Column()
  KD_JABATAN: string;

  @Column({ nullable: true })
  JENIS_SK: string;

  @Column({ nullable: true })
  DOC_NO: string;
}

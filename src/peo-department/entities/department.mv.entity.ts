import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mt_departments', {
  synchronize: true,
})
export class DepartmentMvEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  code: string;

  @Column({ nullable: true })
  is_active: boolean;

  @Column({ nullable: true })
  name: string | null;

  @Column({ nullable: true })
  description: string | null;

  @Column({ nullable: true })
  parent: number | null;

  @Column({ nullable: true })
  source: string | null;

  @Column()
  department_level: number;

  @Column({ nullable: true })
  i_com_code: string | null;

  @Column({ nullable: true })
  i_objid: string | null;

  @Column({ nullable: true })
  i_parid: string | null;

  @Column({ nullable: true })
  i_level_organisasi: number | null;

  @Column({ nullable: true })
  i_bobot_organisasi: string | null;

  @Column({ nullable: true })
  i_endda: Date | null;

  @Column()
  i_version: number;

  @Column({ nullable: true })
  instansi: string | null;

  @Column({ nullable: true })
  i_nama_cabang: string | null;

  @Column({ nullable: true })
  i_kd_wil: string | null;

  @CreateDateColumn()
  i_updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

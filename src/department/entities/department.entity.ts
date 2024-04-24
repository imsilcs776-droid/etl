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
export class Department {
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

  @CreateDateColumn()
  i_updated_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

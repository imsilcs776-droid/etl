import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mt_jobs', {
  synchronize: true,
})
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  code: string;

  @Column({ nullable: true })
  is_active: boolean;

  @Column({ nullable: true })
  name: string | null;

  @Column({ nullable: true })
  source: string | null;

  @Column({ nullable: true })
  description: string | null;

  @Column({ nullable: true })
  i_com_code: string | null;

  @Column({ nullable: true })
  i_objid: string | null;

  @Column({ nullable: true })
  i_parid: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

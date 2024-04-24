import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ims_sync_logs', {
  synchronize: true,
})
export class SyncLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

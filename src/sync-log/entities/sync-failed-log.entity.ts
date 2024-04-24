import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('ims_sync_failed_logs', {
  synchronize: true,
})
export class SyncFailedLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  entity: string;

  @Column({ nullable: true })
  reason: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

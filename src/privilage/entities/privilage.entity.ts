import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Privileges', {
  synchronize: true,
})
export class Privilege {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  role: number;

  @Column({ nullable: true })
  user: string | null;

  @Column({ nullable: true })
  source: string | null;

  @Column({ nullable: true })
  product: number;

  @Column({ nullable: true })
  i_id: string | null;

  @Column({ nullable: true })
  i_nip: string | null;

  @Column({ nullable: true })
  i_role: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

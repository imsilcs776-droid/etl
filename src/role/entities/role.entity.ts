import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('roles', {
  synchronize: true,
})
export class Role {
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
  parent: number | null;

  @Column({ nullable: true })
  i_id: string | null;

  @Column({ nullable: true })
  i_parent: string | null;

  @Column({ nullable: true })
  i_status: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // @ManyToMany(() => User, (user) => user.roles)
  // users: UserMvEntity[];
}

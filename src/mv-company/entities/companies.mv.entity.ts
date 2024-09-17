import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('companies', {
  synchronize: true,
})
export class CompaniesMvEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  user_created: string;

  @Column({ nullable: true })
  user_updated: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  parent: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ nullable: true })
  grup: string;

  @Column({ nullable: true })
  favicon_logo: string;
}
import { v4 as uuidv4 } from 'uuid';
import * as argon from 'argon2';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/role/entities/role.entity';

@Entity('directus_users', {
  synchronize: true,
})
export class UserMvEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, select: false })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ unique: true, nullable: false })
  email: string | null;

  @Column({ nullable: true })
  first_name: string | null;

  @Column({ nullable: true })
  department: number | null;

  @Column({ nullable: true })
  job: number | null;

  @Column({ nullable: true })
  last_name: string | null;

  @Column({ nullable: true })
  full_name: string | null;

  @Column({ nullable: true })
  nip: string | null;

  @Column({ nullable: true })
  nip_new: string | null;

  @Column({ nullable: true })
  role: string | null;

  @Column({ nullable: true })
  company: number | null;

  @Column({ nullable: true })
  source: string | null;

  @Column({ nullable: true })
  i_department_code: string | null;

  @Column({ nullable: true })
  i_com_code: string | null;

  @Column({ nullable: true })
  i_job_code: string | null;

  @Column({ nullable: true })
  i_job_name: string | null;

  @Column({ nullable: true })
  i_werk: string | null;

  @Column({ nullable: true })
  i_id: string | null;

  @Column({ nullable: true })
  i_endda: string | null;

  @Column({ nullable: true })
  pegawai: string | null;

  @Column({ nullable: true })
  instansi: string | null;

  @Column({ nullable: true })
  i_nama_cabang: string | null;

  @Column({ nullable: true })
  i_kd_sub: string | null;

  @Column({ nullable: true })
  i_kd_wil: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  is_active: boolean;

  @Column({ nullable: true })
  i_kd_div: string | null;

  @BeforeInsert()
  beforeInsertActions() {
    this.id = uuidv4();
  }

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      // const salt = await argon.genSalt();
      this.password = await argon.hash(this.password);
    }
  }

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable({
    name: 'Privileges', // Specify the name of the junction table
    joinColumn: {
      name: 'user', // Specify the name of the column in the junction table that references the User entity
    },
    inverseJoinColumn: {
      name: 'role', // Specify the name of the column in the junction table that references the Role entity
    },
  })
  roles: Role[];
}

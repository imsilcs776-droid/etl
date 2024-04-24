import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('directus_roles', {
  synchronize: true,
})
export class RoleSystem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { SyncLogsModule } from 'src/sync-log/sync-log.module';
import { UserMvEntity } from './entities/user.mv.entity';
import { RolePeoEntity } from 'src/peo-role/entity/role.peo.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RoleSystem } from 'src/role/entities/role-system.entity';
import { PrivilegeMvEntity } from './entities/privilage.mv.entity';
import { UserPrivilegeService } from './users-privilege.service';
import { RoleMvEntity } from 'src/peo-role/entity/role.mv.entity';
import { UserDepartmentService } from './users-department.service';
import { DepartmentMvEntity } from 'src/peo-department/entities/department.mv.entity';
import { UsersMutationService } from './users-mutation.service';
import { PrivilegesPortalsiService } from 'src/privilage/privilage-portalsi.service';
import { PegawaiPeoService } from 'src/sink-pegawai/pegawai-peo.service';
import { SyncLogsService } from 'src/sync-log/sync-log.service';
import { Role } from 'src/role/entities/role.entity';
import { CompanyMvModule } from 'src/mv-company/mv-company.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      RolePeoEntity,
      // User,
      // Department,
      // Job,
      RoleSystem,
      // Privilege,
      Role,
      RoleMvEntity,
      PrivilegeMvEntity,
      UserMvEntity,
      DepartmentMvEntity,
    ]),
    SyncLogsModule,
    CompanyMvModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    // UserDepartmentService,
    // UserMDMService,
    // UserJobService,
    // UserPEOService,
    UserPrivilegeService,
    // UserPEOSourceService,
    UsersMutationService,
    // DepartmentMDMService,
    // JobMDMService,
    // PrivilegesPEOService,
    UserDepartmentService,

    PegawaiPeoService,
    PrivilegesPortalsiService,
    SyncLogsService,
  ],
  exports: [
    UsersService,
    UserPrivilegeService,
    UserDepartmentService,
    UsersMutationService,
  ],
})
export class UsersModule {}

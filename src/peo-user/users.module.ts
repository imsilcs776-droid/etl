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
      // Role,
      RoleMvEntity,
      PrivilegeMvEntity,
      UserMvEntity,
      DepartmentMvEntity,
    ]),
    SyncLogsModule,
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
  ],
  exports: [UsersService, UserPrivilegeService, UserDepartmentService],
})
export class UsersModule {}

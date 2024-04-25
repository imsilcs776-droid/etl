// import { Module } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './entities/user.entity';
// import { HttpModule } from '@nestjs/axios';
// import { SyncLogsModule } from 'src/sync-log/sync-log.module';
// import { UserDepartmentService } from './users-department.service';
// import { Department } from 'src/department/entities/department.entity';
// import { UserMDMService } from './users-mdm.service';
// import { UserJobService } from './users-job.service';
// import { Job } from 'src/job/entities/job.entity';
// import { UserPEOService } from './users-peo.service';
// import { RoleSystem } from 'src/role/entities/role-system.entity';
// import { Privilege } from 'src/privilage/entities/privilage.entity';
// import { Role } from 'src/role/entities/role.entity';
// import { UserPrivilegeService } from './users-privilege.service';
// import { UserPEOSourceService } from './users-peo-source.service';
// import { UsersMutationService } from './users-mutation.service';
// import { PrivilegesPEOService } from 'src/privilage/privilage-peo.service';
// import { DepartmentMDMService } from 'src/department/department-mdm.service';
// import { JobMDMService } from 'src/job/job-mdm.service';

// @Module({
//   imports: [
//     HttpModule,
//     TypeOrmModule.forFeature([
//       User,
//       Department,
//       Job,
//       RoleSystem,
//       Privilege,
//       Role,
//     ]),
//     SyncLogsModule,
//   ],
//   controllers: [UsersController],
//   providers: [
//     UsersService,
//     UserDepartmentService,
//     UserMDMService,
//     UserJobService,
//     UserPEOService,
//     UserPrivilegeService,
//     UserPEOSourceService,
//     UsersMutationService,
//     DepartmentMDMService,
//     JobMDMService,
//     PrivilegesPEOService
//   ],
//   exports: [
//     UsersService,
//     UserDepartmentService,
//     UserMDMService,
//     UserJobService,
//     UserPEOService,
//     UserPrivilegeService,
//     UserPEOSourceService,
//     UsersMutationService,
//     DepartmentMDMService,
//     JobMDMService,
//     PrivilegesPEOService
//   ],
// })
// export class UsersModule {}
